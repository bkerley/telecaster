var TelecasterVersion = '0.0.1';
var Telecaster = function() {
  Telecaster.db = new TcDb();
  Telecaster.controller = new TcCtl();
}
var TcDb = Class.create({
  initialize: function() {
    this.db = window.openDatabase('telecaster', TelecasterVersion, 'Telecaster', 2500000);
    this.createTables();
  },
  createTables: function() {
    this.db.transaction(function(t){
      t.executeSql("CREATE TABLE IF NOT EXISTS files(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, content TEXT)");
    });
  },
  select: function(q, a, cb) {
    this.db.transaction(function(t){
      t.executeSql(q, a, cb, function(t, e){
        console.error(e.message);
      });
    });
  },
  update: function(q, a, cb) {
    this.db.transaction(function(t){
      t.executeSql(q, a, cb, function(t, e){
        console.error(e.message);
      });
    });
  },
  create: function(q, a, cb) {
    this.db.transaction(function(t){
      t.executeSql(q, a, cb, function(t, e){
        console.error(e.message);
      });
    });
  }
});

var TcCtl = Class.create({
  initialize: function() {
    this.fileList = $('files');
    this.editor = $('editor');

    this.startFileList();
    this.startEditor();
    this.startIpad();
  },
  startFileList: function() {
    var l = this.fileList;
    l.update("<li class=\"new\">New File</li>");

    var files = TcFile.all(function(r) {
      l.insert({bottom: "<li class=\"existing\" id=\"file_"+r.id+"\">"+r.name+"</li>"});
    });

    l.on('click', 'li.existing', function(e, li) {
      var fileId = li.id.split('_')[1];
      TcFile.one(fileId, function(f) {
        this.loadFile(f);
      }.bind(this));
    }.bind(this));
    l.on('click', 'li.new', function(e, li) {
      this.loadFile(TcFile.blank());
    }.bind(this));

    this.file = TcFile.blank();
  },
  startEditor: function() {
    var chrome = $('editor').up().down('.chrome');
    this.nameField = chrome.down('input#filename');
    chrome.down('#save_button').on('click', function(e) {
      this.saveFile();
    }.bind(this));
    chrome.down('#eval_button').on('click', function(e) {
      this.evalFile();
    }.bind(this));
  },
  startIpad: function() {
    if (!navigator.userAgent.match(/iPad/)) return;
    this.editor.on('focus', function(e) {
      $('editor').up().addClassName('ipad_focus');
    });
    this.editor.on('blur', function(e) {
      var rcn = function(){
        $('editor').up().removeClassName('ipad_focus');
      };
      window.setTimeout(rcn, 500);
    });
  },
  saveFile: function() {
    var content = this.editor.value;
    var filename = this.nameField.value;
    var file = this.file;
    file.name = filename;
    file.content = content;
    file.save();
    this.updateFileList();
  },
  loadFile: function(file) {
    this.editor.value = file.content;
    this.nameField.value = file.name;
    this.file = file;
  },
  evalFile: function(file) {
    window.eval(this.editor.value);
  },
  updateFileList: function() {
    var l = this.fileList;
    l.update("<li class=\"new\">New File</li>");

    var files = TcFile.all(function(r) {
      l.insert({bottom: "<li class=\"existing\" id=\"file_"+r.id+"\">"+r.name+"</li>"});
    });
  }
});

var TcFile = Class.create({
  initialize: function(row) {
    this.id = row.id;
    this.name = row.name;
    this.content = row.content;
  },
  reload: function() {
    this.content = Telecaster.db.loadFile(this.name);
  },
  save: function() {
    if (this.blank) {
      Telecaster.db.create("INSERT INTO files (name, content) VALUES (?, ?)", [this.name, this.content], function(t, r){
        this.id = r.insertId;
        this.blank = false;
      }.bind(this));
    } else {
      Telecaster.db.update("UPDATE files SET name=?, content=? WHERE id=?", [this.name, this.content, this.id], function(t, r){

      }.bind(this));
    }
    this.blank = false;
  }
});
Object.extend(TcFile, {
  all: function(cb) {
    Telecaster.db.select("SELECT * FROM files ORDER BY name ASC", [],
                         function(t, r) {
                           var l = r.rows.length;
                           for(i = 0; i < l; i++) {
                             var f = new TcFile(r.rows.item(i));
                             cb(f);
                           }
                         });
  },
  one: function(id, cb) {
    Telecaster.db.select("SELECT * FROM files WHERE id=? LIMIT 1", [id],
                         function(t, r) {
                           var f = new TcFile(r.rows.item(0));
                           cb(f);
                         });
  },
  blank: function() {
    var f = new TcFile({
      id: null,
      name: '',
      content: ''
    });
    f.blank = true;
    return f;
  }
});