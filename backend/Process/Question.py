import sqlite3
from flask import jsonify, request, abort, Blueprint

# Setup Blueprint and paths
dbPath = 'database.sqlite'
questionBP = Blueprint('questionBP', __name__)

# Question list to dict
def questionDict(row):
    questionDict = {
        'questionID': row[0],
        'courseID': row[1],
        'chapterID': row[2],
        'questionAsk': row[3],
        'questionOpt1': row[4],
        'questionOpt2': row[5],
        'questionOpt3': row[6],
        'questionOpt4': row[7],
        'questionAns': row[8],
    }
    return questionDict

# List all Questions of Chapter
@questionBP.route('/<int:courseID>/<int:chapterID>/question', methods=['GET'])
def questionList(courseID, chapterID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch all Questions
        cursor = db.cursor()
        cursor.execute('''SELECT * FROM question 
            WHERE chapterID = ?''', [chapterID])
        rows = cursor.fetchall()

        questionList = []
        for row in rows:
            questionList.append(questionDict(row))
        return jsonify(questionList), 200
    except:
        abort(400)
    finally:
        db.close()

# Get specific Question od Chapter
@questionBP.route('/<int:courseID>/<int:chapterID>/question/<int:questionID>', methods=['GET'])
def questionGet(courseID, chapterID, questionID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch one Question
        cursor = db.cursor()
        cursor.execute('''SELECT * FROM question 
            WHERE questionID = ?''', [questionID])
        row = cursor.fetchone()

        if row:
            return jsonify(questionDict(row)), 200
        else:
            return jsonify(None), 200
    except:
        abort(400)
    finally:
        db.close()

# Add new Question to Chapter
@questionBP.route('/<int:courseID>/<int:chapterID>/question', methods=['POST'])
def questionAdd(courseID, chapterID):
    if not request.json:
        abort(404)

    db = sqlite3.connect(dbPath)
    try:
        # New Question details
        newQuestion = (
            courseID,
            chapterID,
            request.json['questionAsk'],
            request.json['questionOpt1'],
            request.json['questionOpt2'],
            request.json['questionOpt3'],
            request.json['questionOpt4'],
            request.json['questionAns'],
        )

        # Add Question to Database
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO question(courseID, 
                chapterID, questionAsk, questionOpt1, 
                questionOpt2, questionOpt3, questionOpt4, questionAns)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
        ''', newQuestion)
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 201
    except:
        abort(400)
    finally:
        db.close()

# Update Question
@questionBP.route('/<int:courseID>/<int:chapterID>/question/<int:questionID>', methods=['PUT'])
def questionEdit(courseID, chapterID, questionID):
    if not request.json:
        abort(400)

    db = sqlite3.connect(dbPath)
    try:
        # Updated Question details
        updateQuestion = (
            courseID,
            chapterID,
            request.json['questionAsk'],
            request.json['questionOpt1'],
            request.json['questionOpt2'],
            request.json['questionOpt3'],
            request.json['questionOpt4'],
            request.json['questionAns'],
            questionID,
        )

        # Insert Question updates into Database
        cursor = db.cursor()
        cursor.execute('''
            UPDATE question 
            SET courseID = ?,
                chapterID = ?,
                questionAsk = ?,
                questionOpt1 = ?,
                questionOpt2 = ?,
                questionOpt3 = ?,
                questionOpt4 = ?,
                questionAns = ?
            WHERE questionID = ?
        ''', updateQuestion)
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 200
    except:
        abort(400)
    finally:
        db.close()

# Delete Question
@questionBP.route('/<int:courseID>/<int:chapterID>/question/<int:questionID>', methods=['DELETE'])
def chapterDelete(courseID, chapterID, questionID):
    if not request.json:
        abort(400)
    
    if 'questionID' not in request.json:
        abort(400)
    
    db = sqlite3.connect(dbPath)
    db.execute("PRAGMA foreign_keys=ON")
    try:
        # Delete Question from Database
        cursor = db.cursor()
        cursor.execute('''DELETE FROM question 
            WHERE questionID = ?''', [questionID])
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 201
    except:
        abort(400)
    finally:
        db.close()