import sqlite3
from flask import Flask, jsonify, abort
from argparse import ArgumentParser

# Setup Paths
app = Flask(__name__)
dbPath = 'database.sqlite'

# List all recorded dates
@app.route('/<int:courseID>/history', methods = ['GET'])
def historyDateList(courseID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch all History
        cursor = db.cursor()
        cursor.execute('''SELECT DISTINCT quizDate FROM history 
            WHERE courseID = ? 
            ORDER BY quizDate DESC''', [courseID])
        rows = cursor.fetchall()

        dateList = []
        for row in rows:
            dateList.append(row[0])
        return jsonify(dateList), 200
    except:
        abort(400)
    finally:
        db.close()

# List all recorded dates of account
@app.route('/<int:courseID>/history/<int:accountID>', methods = ['GET'])
def historyDateGet(courseID, accountID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch all History
        cursor = db.cursor()
        cursor.execute('''SELECT DISTINCT quizDate FROM history 
            WHERE courseID = ? AND accountID = ?
            ORDER BY quizDate DESC''', [courseID, accountID])
        rows = cursor.fetchall()

        dateList = []
        for row in rows:
            dateList.append(row[0])
        return jsonify(dateList), 200
    except:
        abort(400)
    finally:
        db.close()

# List all History of Date
@app.route('/<int:courseID>/<string:quizDate>/history', methods = ['GET'])
def historyList(quizDate, courseID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch all History of specific Date
        cursor = db.cursor()
        cursor.execute('''SELECT h.historyID, a.accountName, h.quizDate
            FROM history AS h
            LEFT JOIN account AS a USING (accountID)
            WHERE courseID = ? AND quizDate = ?
            ORDER BY h.historyID DESC''', [courseID, quizDate])
        rows = cursor.fetchall()

        historyList = []
        for row in rows:
            historyElement = {
                'historyID': row[0],
                'accountName': row[1],
                'quizDate': row[2],
            }
            historyList.append(historyElement)
        return jsonify(historyList), 200
    except:
        abort(400)
    finally:
        db.close()

# Get all History of a User of Date
@app.route('/<int:courseID>/<string:quizDate>/history/<int:accountID>', methods=['GET'])
def historyListUser(courseID, quizDate, accountID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch all user History
        cursor = db.cursor()
        cursor.execute('''SELECT * FROM history 
            WHERE courseID = ? AND accountID = ? 
            AND quizDate = ?
            ORDER BY historyID DESC''', [courseID, accountID, quizDate])
        rows = cursor.fetchall()

        historyList = []
        for row in rows:
            historyDict = {
                'historyID': row[0],
                'accountID': row[1],
                'courseID': row[2],
                'quizDate': row[3],
            }
            historyList.append(historyDict)
        return jsonify(historyList), 200
    except:
        abort(400)
    finally:
        db.close()

# Get questionList of history
@app.route('/questionHistory/<int:historyID>', methods=['GET'])
def quesHistoryGet(historyID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch questionList of history
        cursor = db.cursor()
        cursor.execute('''SELECT q.questionAsk, q.questionOpt1, q.questionOpt2, 
                q.questionOpt3, q.questionOpt4, q.questionAns, qh.answer
            FROM quesHistory AS qh
            JOIN question AS q USING (questionID)
            WHERE historyID = ?''', [historyID])
        rows = cursor.fetchall()

        questionList = []
        answerList = []
        for row in rows:
            question = {
                'questionAsk': row[0],
                'questionOpt1': row[1],
                'questionOpt2': row[2],
                'questionOpt3': row[3],
                'questionOpt4': row[4],
                'questionAns': row[5],
            }
            questionList.append(question)
            answerList.append(row[6])
        return jsonify({'questionList': questionList, 'answerList': answerList}), 200
    except:
        abort(400)
    finally:
        db.close()

# Run flask application
if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=7000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)