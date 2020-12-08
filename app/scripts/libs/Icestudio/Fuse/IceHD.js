class IceHD {

    constructor() {

        this.fs = require('fs');
        this.path = require('path');
    }
    

    isDir(path) {
        return this.fs.existsSync(path) && this.fs.lstatSync(path).isDirectory();
    }
    isFile(path) {
        return this.fs.lstatSync(path).isFile();
    }

    isSymbolicLink(path) {
        return this.fs.lstatSync(path).isSymbolicLink();
    }

    joinPath(folder,name){
        return this.path.join(folder, name);
    }

    basename(filepath) {
        let b = this.path.basename(filepath);
        return (b.indexOf('.')<0)? b : b.substr(0, b.lastIndexOf('.'));
    }

    readDir(folder){
        let content=[];
        if(this.isDir(folder)){
            content=this.fs.readdirSync(folder);
        }
        return content;
        
    }

    getFilesRecursive(folder, level) {
        let _this=this;
        let fileTree = [];
        const validator = /.*\.(ice|json|md)$/;
        try {
            let content = this.fs.readdirSync(folder);
            level--;

            content.forEach(function (name) {
                let path = _this.joinPath(folder, name);
                if (_this.isDir(path)) {
                    fileTree.push({
                        name: name,
                        path: path,
                        children: (level >= 0) ? _this.getFilesRecursive(path, level) : []
                    });
                } else if (validator.test(name)) {
                    fileTree.push({
                        name: _this.basename(name),
                        path: path
                    });
                }
            });
        } catch (e) {
            //-- If dir not exists , hide exception on read
            //-- D# console.warn(e);
        }

        return fileTree;
    }
}