from flask import Flask
from argparse import ArgumentParser
from Process.Account import accBP
from Process.Course import courseBP
from Process.Chapter import chapterBP
from Process.Question import questionBP
from Process.Note import noteBP

# Register Blueprints
app = Flask(__name__)
app.register_blueprint(accBP)
app.register_blueprint(courseBP)
app.register_blueprint(chapterBP)
app.register_blueprint(questionBP)
app.register_blueprint(noteBP)

# Run Flask application
if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)