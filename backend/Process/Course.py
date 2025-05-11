import sqlite3, os, shutil
from flask import jsonify, request, abort, Blueprint

# Setup Blueprint and paths
dbPath = 'database.sqlite'
current_directory = os.getcwd()
courseBP = Blueprint('courseBP', __name__)

# Course list to dict
def courseDict(row):
    courseDict = {
        'courseID': row[0],
        'courseCode':row[1],
        'courseName':row[2],
    }
    return courseDict

# List all Courses
@courseBP.route('/course', methods=['GET'])
def courseList():
    db = sqlite3.connect(dbPath)
    try:
        # Fetch all Courses
        cursor = db.cursor()
        cursor.execute('SELECT * FROM course')
        rows = cursor.fetchall()

        courseList = []
        for row in rows:
            courseList.append(courseDict(row))
        return jsonify(courseList), 200
    except:
        abort(400)
    finally:
        db.close()

# Get specific Course
@courseBP.route('/course/<int:courseID>', methods=['GET'])
def courseGet(courseID):
    db = sqlite3.connect(dbPath)
    try:
        # Fetch one Course
        cursor = db.cursor()
        cursor.execute('''SELECT * FROM course 
            WHERE courseID = ?''', [courseID])
        row = cursor.fetchone()

        if row:
            return jsonify(courseDict(row)), 200
        else:
            return jsonify(None), 200
    except:
        abort(400)
    finally:
        db.close()

# Add new Course
@courseBP.route('/course', methods=['POST'])
def courseAdd():
    if not request.json:
        abort(404)

    db = sqlite3.connect(dbPath)
    try:
        # New Course details
        newCourse = (
            request.json['courseCode'],
            request.json['courseName'],
        )

        # Add Course to Database
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO course(courseCode, courseName)
            VALUES(?, ?)
        ''', newCourse)
        db.commit()
        
        # Create New Note Folder
        os.mkdir(current_directory + "\\Notes\\" + str(cursor.lastrowid))
        
        response = {'affected': db.total_changes}
        return jsonify(response), 201
    except:
        abort(400)
    finally:
        db.close()

# Update Course
@courseBP.route('/course/<int:courseID>', methods=['PUT'])
def courseEdit(courseID):
    if not request.json:
        abort(400)

    db = sqlite3.connect(dbPath)
    try:
        # Updated Course details
        courseUpdate = (
            request.json['courseCode'],
            request.json['courseName'],
            courseID,
        )

        # Insert Course updates into Database
        cursor = db.cursor()
        cursor.execute('''
            UPDATE course 
            SET courseCode = ?, 
                courseName = ?
            WHERE courseID = ?
        ''', courseUpdate)
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 200
    except:
        abort(400)
    finally:
        db.close()

# Delete Course
@courseBP.route('/course/<int:courseID>', methods=['DELETE'])
def courseDelete(courseID):
    if not request.json:
        abort(400)
    
    if 'courseID' not in request.json:
        abort(400)
    
    db = sqlite3.connect(dbPath)
    db.execute("PRAGMA foreign_keys=ON")
    try:
        # Remove Notes Folder
        shutil.rmtree(current_directory + "\\Notes\\" + str(courseID))

        # Delete Course from Database
        cursor = db.cursor()
        cursor.execute('''DELETE FROM course 
            WHERE courseID = ?''', [courseID])
        db.commit()

        response = {'affected': db.total_changes}
        return jsonify(response), 201
    except:
        abort(400)
    finally:
        db.close()