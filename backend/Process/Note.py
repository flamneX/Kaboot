from flask import jsonify, request, abort, Blueprint
import os.path

# Setup Blueprint and paths
current_directory = os.getcwd()
noteBP = Blueprint('noteBP', __name__)

# Read Note from file
@noteBP.route('/<int:courseID>/<int:chapterID>/note', methods=['GET'])
def getNote(courseID, chapterID):
    try:
        # Create Notes folder if it does not exist
        noteFolder = current_directory + "\\Notes"
        if not os.path.exists(noteFolder):
            os.mkdir(noteFolder)

        # Create courseID folder if it does not exist
        courseDir = noteFolder + "\\" + str(courseID)
        if not os.path.exists(courseDir):
            os.mkdir(courseDir)
        
        # Create chapterID file if it does not exist
        filePath = courseDir + "\\" + str(chapterID) + ".txt"
        if not os.path.exists(filePath):
            open(filePath, 'x')

        # Open and read the contents of note file
        with open(filePath, "r") as f:
            return jsonify(f.read()), 200
    except:
        abort(400)

# Update Note details
@noteBP.route('/<int:courseID>/<int:chapterID>/note', methods=['PUT'])
def noteEdit(courseID, chapterID):
    if not request.json:
        abort(400)

    try:
        # Writing contents of new note into the file
        file_path = current_directory + "\\Notes\\" + str(courseID) + "\\" + str(chapterID) + ".txt"
        newNote = request.json['note']
        with open(file_path, "w") as f:
            f.write(newNote)
        
        response = {'affected': len(newNote)}
        return jsonify(response), 200
    except:
        abort(400)