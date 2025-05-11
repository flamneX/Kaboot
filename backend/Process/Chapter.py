import sqlite3, os
from flask import jsonify, request, abort, Blueprint

# Setup Blueprint and paths
dbPath = 'database.sqlite'
current_directory = os.getcwd()
chapterBP = Blueprint('chapterBP', __name__)

# Chapter list to dict
def chapterDict(row):
    chapterDict = {
        'chapterID': row[0],
        'courseID': row[1],
        'chapterNo':row[2],
        'chapterName':row[3],
    }
    return chapterDict

# List all Chapters of Course
@chapterBP.route('/<int:courseID>/chapter', methods=['GET'])
def chapterList(courseID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch all Chapters
        cursor = db.cursor()
        cursor.execute('''SELECT * FROM chapter 
            WHERE courseID = ?''', [courseID])
        rows = cursor.fetchall()

        chapterList = []
        for row in rows:
            chapterList.append(chapterDict(row))
        return jsonify(chapterList), 200
    except:
        abort(400)
    finally:
        db.close()

# Get specific Chapter of Course
@chapterBP.route('/<int:courseID>/chapter/<int:chapterID>', methods=['GET'])
def chapterGet(courseID, chapterID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch one Chapter
        cursor = db.cursor()
        cursor.execute('''SELECT * FROM chapter 
            WHERE chapterID = ?''', [chapterID])
        row = cursor.fetchone()

        if row:
            return jsonify(chapterDict(row)), 200
        else:
            return jsonify(None), 200
    except:
        abort(400)
    finally:
        db.close()

# Add new Chapter to Course
@chapterBP.route('/<int:courseID>/chapter', methods=['POST'])
def chapterAdd(courseID):
    if not request.json:
        abort(404)

    db = sqlite3.connect(dbPath)
    try:
        # New Chapter details
        newchapter = (
            courseID,
            request.json['chapterNo'],
            request.json['chapterName'],
        )

        # Add Chapter to Database
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO chapter(courseID, chapterNo, chapterName)
            VALUES(?, ?, ?)
        ''', newchapter)
        db.commit()

        # Create new Note File
        open(current_directory + "\\Notes\\" + str(courseID) + '\\' + str(cursor.lastrowid) + '.txt', 'x')

        response = {'affected': db.total_changes}
        return jsonify(response), 201
    except:
        abort(400)
    finally:
        db.close()

# Update Chapter
@chapterBP.route('/<int:courseID>/chapter/<int:chapterID>', methods=['PUT'])
def chapterEdit(courseID, chapterID):
    if not request.json:
        abort(400)

    db = sqlite3.connect(dbPath)
    try:
        # Updated Chapter details
        chapterUpdate = (
            courseID,
            request.json['chapterNo'],
            request.json['chapterName'],
            chapterID,
        )

        # Insert Chapter updates into Database
        cursor = db.cursor()
        cursor.execute('''
            UPDATE chapter 
            SET courseID = ?,
                chapterNo = ?,
                chapterName = ?
            WHERE chapterID = ?
        ''', chapterUpdate)
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 200
    except:
        abort(400)
    finally:
        db.close()

# Delete Chapter
@chapterBP.route('/<int:courseID>/chapter/<int:chapterID>', methods=['DELETE'])
def chapterDelete(courseID, chapterID):
    if not request.json:
        abort(400)

    if 'chapterID' not in request.json:
        abort(400)
    
    db = sqlite3.connect(dbPath)
    db.execute("PRAGMA foreign_keys=ON")
    try:
        # Delete Chapter from Database
        cursor = db.cursor()
        cursor.execute('''DELETE FROM chapter 
            WHERE chapterID = ?''', [chapterID])
        db.commit()
       
        # Delete Note File
        os.remove(current_directory + "\\Notes\\" + str(courseID) + '\\' + str(chapterID) + '.txt')

        response = {'affected': db.total_changes}
        return jsonify(response), 201
    except:
        abort(400)
    finally:
        db.close()