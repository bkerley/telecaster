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
  select: function(q) {

  },
  selectHandler: function(t, r) {

  }
});

var TcCtl = Class.create({
  initialize: function() {
    this.fileList = $('files');
    this.editor = $('editor');

    this.startFileList();
  },
  startFileList: function() {
    var l = this.fileList;
    l.update('');
    var files = TcFile.all(function(r) {
      l.insert({bottom: "<li id=\"file_"+r.id+"\">"+r.name+"</li>"});
    });
  }
});

var TcFile = Class.create({
  initialize: function(row) {
    this.dirty = false;
    this.id = row.id;
    this.name = row.filename;
    this.content = row.content;
  },
  reload: function() {
    this.content = Telecaster.db.loadFile(this.name);
  }
});
Object.extend(TcFile, {
  all: function(cb) {
    Telecaster.db.select("SELECT * FROM files ORDER BY filename ASC",
      function(r) {
        var f = new TcFile(r);
        cb(r);
      });
    }
});