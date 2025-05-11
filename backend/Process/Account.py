import sqlite3
from flask import jsonify, request, abort, Blueprint

# Setup Blueprint and paths
dbPath = 'database.sqlite'
accBP = Blueprint('accBP', __name__)

# Account list to dict
def accDict(row):
    accDict = {
        'accountID': row[0],
        'accountName':row[1],
        'accountPass':row[2],
        'accountEmail':row[3],
        'accountRole':row[4],
    }
    return accDict

# List all Accounts
@accBP.route('/account', methods=['GET'])
def accList():
    db = sqlite3.connect(dbPath)
    try:
        # Fetch all Accounts
        cursor = db.cursor()
        cursor.execute('SELECT * FROM account')
        rows = cursor.fetchall()

        accList = []
        for row in rows:
            accList.append(accDict(row))
        return jsonify(accList), 200
    except:
        abort(400)
    finally:
        db.close()

# List all Accounts of a Role
@accBP.route('/account/<accountRole>', methods=['GET'])
def accRoleList(accountRole):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch accounts with the same accountRole
        cursor = db.cursor()
        cursor.execute('''SELECT * FROM account 
            WHERE accountRole = ?''', [accountRole])
        rows = cursor.fetchall()

        accList = []
        for row in rows:
            accList.append(accDict(row))
        return jsonify(accList), 200
    except:
        abort(400)
    finally:
        db.close()

# Get specific Account
@accBP.route('/account/<int:accountID>', methods=['GET'])
def accInfo(accountID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch one Account
        cursor = db.cursor()
        cursor.execute('''SELECT * FROM account 
            WHERE accountID = ?''', [accountID])
        row = cursor.fetchone()

        if row:
            return jsonify(accDict(row)), 200
        else:
            return jsonify(None), 200
    except:
        abort(400)
    finally:
        db.close()

# Add new Account
@accBP.route('/account', methods=['POST'])
def accountAdd():
    if not request.json:
        abort(404)

    db = sqlite3.connect(dbPath)
    try:
        # New Account details
        newAccount = (
            request.json['accountName'],
            request.json['accountPass'],
            request.json['accountEmail'],
            request.json['accountRole'],
        )

        # Add Account to Database
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO account(accountName, accountPass, accountEmail, accountRole)
            VALUES(?, ?, ?, ?)
        ''', newAccount)
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 201
    except:
        abort(400)
    finally:
        db.close()

# Update Account
@accBP.route('/account/<int:accountID>', methods=['PUT'])
def accEdit(accountID):
    if not request.json:
        abort(400)

    db = sqlite3.connect(dbPath)
    try:
        # Updated Account details
        accUpdate = (
            request.json['accountName'],
            request.json['accountPass'],
            request.json['accountEmail'],
            request.json['accountRole'],
            accountID,
        )

        # Insert Account updates into Database
        cursor = db.cursor()
        cursor.execute('''
            UPDATE account 
            SET accountName = ?,
                accountPass = ?,
                accountEmail = ?,
                accountRole = ?
            WHERE accountID = ?
        ''', accUpdate)
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 200
    except:
        abort(400)
    finally:
        db.close()

# Delete Account
@accBP.route('/account/<int:accountID>', methods=['DELETE'])
def accDelete(accountID):
    if not request.json:
        abort(400)

    if 'accountID' not in request.json:
        abort(400)

    db = sqlite3.connect(dbPath)
    db.execute("PRAGMA foreign_keys=ON")
    try:
        # Delete Account from Database
        cursor = db.cursor()
        cursor.execute('''DELETE FROM account
            WHERE accountID = ?''', [accountID])
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 201
    except:
        abort(400)
    finally:
        db.close()