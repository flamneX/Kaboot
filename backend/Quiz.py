import sqlite3, random, json
from datetime import datetime
from flask import Flask, abort
from flask_socketio import SocketIO, emit

# Setup Socket io and paths
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
dbPath = 'database.sqlite'

# Connected to Client
@socketio.on('connect', namespace = '/quiz')
def handleConnection():
    print('Connected')

# Randomize Questions from Client
@socketio.on('question_client', namespace='/quiz')
def handleQuestionRandomize(jsonData):
    questionList = jsonData['questionList']
    questionNo = int(jsonData['questionNo'])

    newList = random.sample(questionList, questionNo)

    # Send Randomized Questions
    emit('question_server', json.dumps({
        'questionList': newList,
    }), namespace='/quiz')

# Validate Answers from Client
@socketio.on('answer_client', namespace='/quiz')
def handleAnswerValidate(jsonData):
    questionList = jsonData['questionList']
    answerList = jsonData['answerList']
    correct = 0
    incorrect = len(questionList)

    # Validate amt of correct answers
    for i in range(len(questionList)):
        if questionList[i]['questionAns'] == answerList[i]:
            correct += 1
            incorrect -= 1

    # Send Validated Answers
    emit('answer_server', json.dumps({
        'correct': correct,
        'incorrect': incorrect,
        'quizDate': datetime.now().strftime('%Y-%m-%d'),
    }), namespace='/quiz')

# Record Quiz Attempts
@socketio.on('quiz_submit_client', namespace='/quiz')
def handleQuizSubmit(jsonData):
    # Get Record of Quiz
    questionList = jsonData['questionList']
    answerList = jsonData['answerList']

    # Insert Record into Database
    db = sqlite3.connect(dbPath)
    cursor = db.cursor()
    try:
        # Quiz Attempt details
        attempt = (
            jsonData['courseID'],
            jsonData['accountID'],
            datetime.now().strftime('%Y-%m-%d'),
        )
        # Insert data
        cursor.execute('''
            INSERT INTO history(courseID, accountID, quizDate)
            VALUES(?, ?, ?)
        ''', attempt)
        db.commit()
        
        
        # Insert question record into database
        historyID = cursor.lastrowid
        for i in range(len(questionList)):
            # Question Record details
            newRecord = (
                historyID,
                questionList[i]["questionID"],
                answerList[i],
            )
            # Insert data
            cursor.execute('''
                INSERT INTO quesHistory(historyID, questionID, answer)
                VALUES(?, ?, ?)
            ''', newRecord)
            db.commit()
    except:
        abort(400)
    finally:
        db.close()

# Run the web socket
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=6000,debug='false')