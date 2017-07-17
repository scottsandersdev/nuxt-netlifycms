var articlesFolder = './content/articles/';
var fs = require('fs');
var marked = require('marked');
var matter = require('gray-matter');
var allArticles = {};
var articleRoutes = [];
var articlePath = '/articles/';

module.exports.parse = function() {
  fs.readdir(articlesFolder, function( err, files) {
      if ( err ) {
          console.log("Error reading files: ", err);
      } else {
          // keep track of how many we have to go.
          var remaining = files.length;
          var totalBytes = 0;

          if ( remaining == 0 ) {
              console.log("Done reading files. totalBytes: " +
                  totalBytes);
          }
          // iterate over each file
          for ( var i = 0; i < files.length; i++ ) {
              // read its contents.
              fs.readFile(articlesFolder + files[i], function( error, data ) {
                  if ( error ) {
                      console.log("Error: ", error);
                  } else {
                    var obj = matter(data);
                    obj.content = marked(obj.content);
                    allArticles[obj.data.title] = obj;
                    articleRoutes.push(articlePath+obj.data.title);
                  }
                  remaining -= 1;
                  if ( remaining == 0 ) {
                      console.log("Done parsing articles "+articleRoutes);
                      return JSON.stringify(allArticles);
                  }
              });
          }
      }
  });
}();
