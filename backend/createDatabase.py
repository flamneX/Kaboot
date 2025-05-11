import sqlite3
db = sqlite3.connect('database.sqlite')

# Create Account Table
db.execute('DROP TABLE IF EXISTS account')
db.execute('''CREATE TABLE account (
    accountID INTEGER PRIMARY KEY AUTOINCREMENT,
    accountName TEXT NOT NULL UNIQUE,
    accountPass TEXT NOT NULL,
    accountEmail TEXT NOT NULL,
    accountRole TEXT NOT NULL
    )'''
)

# Create Course Table
db.execute('DROP TABLE IF EXISTS course')
db.execute('''CREATE TABLE course (
    courseID INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT NOT NULL UNIQUE,
    courseName TEXT NOT NULL
    )'''
)

# Create Chapter Table
db.execute('DROP TABLE IF EXISTS chapter')
db.execute('''CREATE TABLE chapter (
    chapterID INTEGER PRIMARY KEY AUTOINCREMENT,
    courseID INTEGER NOT NULL REFERENCES course(courseID) ON DELETE CASCADE,
    chapterNo INTEGER NOT NULL,
    chapterName TEXT NOT NULL
    )'''
)

# Create Question Table
db.execute('DROP TABLE IF EXISTS question')
db.execute('''CREATE TABLE question (
    questionID INTEGER PRIMARY KEY AUTOINCREMENT,
    courseID INTEGER NOT NULL REFERENCES course(courseID) ON DELETE CASCADE,
    chapterID INTEGER NOT NULL REFERENCES chapter(chapterID) ON DELETE CASCADE,
    questionAsk TEXT NOT NULL,
    questionOpt1 TEXT NOT NULL,
    questionOpt2 TEXT NOT NULL,
    questionOpt3 TEXT NOT NULL,
    questionOpt4 TEXT NOT NULL,
    questionAns TEXT NOT NULL
    )'''
)

# Create Quiz History Table
db.execute('DROP TABLE IF EXISTS history')
db.execute('''CREATE TABLE history (
    historyID INTEGER PRIMARY KEY AUTOINCREMENT,
    accountID INTEGER NOT NULL REFERENCES account(accountID) ON DELETE CASCADE,
    courseID INTEGER NOT NULL REFERENCES course(courseID) ON DELETE CASCADE,
    quizDate DATETIME NOT NULL
    );'''
)

# Create Quiz Question History Table
db.execute('DROP TABLE IF EXISTS quesHistory')
db.execute('''CREATE TABLE quesHistory (
    quesHistoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    historyID INTEGER NOT NULL REFERENCES history(historyID) ON DELETE CASCADE ON UPDATE CASCADE,
    questionID INTEGER NOT NULL REFERENCES question(questionID) ON DELETE CASCADE ON UPDATE CASCADE,
    answer TEXT NOT NULL
    )'''
)

cursor = db.cursor()

# Insert Accounts
cursor.execute('''
    INSERT INTO account(accountName, accountPass, accountEmail, accountRole)
    VALUES('kirito27', 'kirito', 'kirito27@gmail.com', 'ADMIN')
''')

cursor.execute('''
    INSERT INTO account(accountName, accountPass, accountEmail, accountRole)
    VALUES('wilson48', 'wilson', 'wilson48@gmail.com', 'ADMIN')
''')

cursor.execute('''
    INSERT INTO account(accountName, accountPass, accountEmail, accountRole)
    VALUES('yxiao28', 'yxiao', 'yxiao28@gmail.com', 'ADMIN')
''')

cursor.execute('''
    INSERT INTO account(accountName, accountPass, accountEmail, accountRole)
    VALUES('alice14', 'alice', 'alice14@gmail.com', 'STUDENT')
''')

cursor.execute('''
    INSERT INTO account(accountName, accountPass, accountEmail, accountRole)
    VALUES('smith78', 'smith', 'smith78@gmail.com', 'STUDENT')
''')

cursor.execute('''
    INSERT INTO account(accountName, accountPass, accountEmail, accountRole)
    VALUES('charlie27', 'charlie', 'charlie27@gmail.com', 'STUDENT')
''')

# Insert Courses
cursor.execute('''
    INSERT INTO course(courseCode, courseName)
    VALUES('UECS2453', 'Problem Solving with Data Structure and Algorithm')
''')

cursor.execute('''
    INSERT INTO course(courseCode, courseName)
    VALUES('UECS3253', 'Wireless Application Development')
''')

cursor.execute('''
    INSERT INTO course(courseCode, courseName)
    VALUES('TRB51582', 'Terrestrial Biology')
''')

# Insert Chapters
# Course 1
cursor.execute('''
    INSERT INTO chapter(courseID, chapterNo, chapterName)
    VALUES(1, 1, 'Data Structure')
''')

cursor.execute('''
    INSERT INTO chapter(courseID, chapterNo, chapterName)
    VALUES(1, 2, 'Algorithm')
''')

# Course 2
cursor.execute('''
    INSERT INTO chapter(courseID, chapterNo, chapterName)
    VALUES(2, 1, 'Development of Wireless Application')
''')

cursor.execute('''
    INSERT INTO chapter(courseID, chapterNo, chapterName)
    VALUES(2, 2, 'Data Persistence')
''')

# Course 3
cursor.execute('''
    INSERT INTO chapter(courseID, chapterNo, chapterName)
    VALUES(3, 1, 'Zoology')
''')

cursor.execute('''
    INSERT INTO chapter(courseID, chapterNo, chapterName)
    VALUES(3, 2, 'Botany')
''')

# Insert Questions
# Course 1 - Chapter 1
cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(1, 1, 'Which data structure fits the LIFO concept?', 'Queue', 'Map', 'Stack', 'Tree', 'C')
''')

cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(1, 1, 'Which data structure follows the first come first serve concept?', 'Set', 'Heap', 'Graph', 'Queue', 'D')
''')

# Course 1 - Chapter 2
cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(1, 2, 'Which of the following Big O notation has the shortest runtime?', 'log n', 'n', 'n^2', '2^n', 'A')
''')

cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(1, 2, 'What is the time complexity of a nested loop?', 'Quadratic time', 'Linear time', 'Logarithmic time', 'Constant time', 'A')
''')

# Course 2 - Chapter 1
cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(2, 3, 'Which of the following is a react hook?', 'useLater', 'useEffect', 'useAlways', 'useBefore', 'B')
''')

cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(2, 3, 'Which of the following is not a phase of the component lifecycle?', 'Updating', 'Mounting', 'Rendering', 'Unmounting', 'C')
''')

# Course 2 - Chapter 2
cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(2, 4, 'Which of the following is true about AsyncStorage?', 'Data is persisted on the cloud', 'Data is stored in the form of array', 'Data persists between app restarts and during upgrades', 'Data is kept if the app is deleted', 'C')
''')

cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(2, 4, 'Which simple storage system is global to the app and persist locally on the device in an unencrypted form?', 'SQLite', 'AsyncStorage', 'Web Service', 'Internet Socket', 'B')
''')

# Course 3 - Chapter 1
cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(3, 5, 'What is a key feature of mantis shrimp vision?', 'Complex visual systems with photoreceptor cells', 'Highly sensitive sense of taste', 'Echolocation', 'Highly developed sense of hearing', 'A')
''')

cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(3, 5, 'What is the purpose of dominance hierarchies in animal social behavior?', 'Socialize and form friendships', 'Ensure equal resources among members', 'Make animal more aggressive and competitive', 'Reduce conflict by establishing clear social ranks', 'D')
''')

# Course 3 - Chapter 2
cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(3, 6, 'I.Reduction\nII.Carbohydrate Formation\nIII.Regeneration of RuBP\nIV.Carbon Fixation\n\nSequence of Calvin Cycle.', 'IV>I>III>II', 'IV>III>I>II', 'II>I>III>IV', 'I>IV>II>III', 'A')
''')

cursor.execute('''
    INSERT INTO question(courseID, chapterID, questionAsk, questionOpt1, questionOpt2, questionOpt3, questionOpt4, questionAns)
    VALUES(3, 6, 'Which plant tissue is responsible for transporting water and nutrients throughout the plant?', 'Sclerenchyma tissue', 'Ground tissue', 'Vascular tissue', 'Epidermal tissue', 'C')
''')

# Insert Quiz History
cursor.execute('''
    INSERT INTO history(accountID, courseID, quizDate)
    VALUES(4, 1, '2025-05-01')
''')

cursor.execute('''
    INSERT INTO history(accountID, courseID, quizDate)
    VALUES(5, 3, '2025-05-01')
''')

# Insert Question List
# Attempt 1
cursor.execute('''
    INSERT INTO quesHistory(historyID, questionID, answer)
    VALUES(1, 2, 'A')
''')

cursor.execute('''
    INSERT INTO quesHistory(historyID, questionID, answer)
    VALUES(1, 3, 'A')
''')

cursor.execute('''
    INSERT INTO quesHistory(historyID, questionID, answer)
    VALUES(1, 4, 'C')
''')

cursor.execute('''
    INSERT INTO quesHistory(historyID, questionID, answer)
    VALUES(1, 1, 'A')
''')

# Attempt 2
cursor.execute('''
    INSERT INTO quesHistory(historyID, questionID, answer)
    VALUES(2, 10, 'A')
''')

cursor.execute('''
    INSERT INTO quesHistory(historyID, questionID, answer)
    VALUES(2, 9, 'A')
''')

cursor.execute('''
    INSERT INTO quesHistory(historyID, questionID, answer)
    VALUES(2, 12, 'C')
''')

cursor.execute('''
    INSERT INTO quesHistory(historyID, questionID, answer)
    VALUES(2, 11, 'A')
''')

db.commit()
db.close()