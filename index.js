var pleer = require('pleer');
var Promise = require('bluebird');  
var chalk = require('chalk');
var prompt = require('prompt');
var fs = require('fs');
var http = require('http');
var Table = require('cli-table3');
var program = require('commander');
Promise.promisifyAll(pleer);

program.version('0.0.1')
  .parse(process.argv);
var query = program.args.join(' ');
var trs = [];

pleer.searchAsync(query).then(function(re) {
    for (var i = 0; i < re.tracks.length; i++) {
        var tr = {};
        tr.id = re.tracks[i].track_id;
        tr.artist = re.tracks[i].artist;
        tr.song = re.tracks[i].track;
        tr.bitrate = re.tracks[i].bitrate;
        trs.push(tr);
    }
}).then(function(){
    var table = new Table({
        head: ['I', 'Artist', 'Song', 'Bitrate']
    });
    for (i=0;i<trs.length;i++){
        var artist = chalk.green(trs[i].artist);
        var song = chalk.red(trs[i].song);
        var bitrate = chalk.yellow(trs[i].bitrate);
        table.push([i, artist, song, bitrate]);
    }
    console.log(table.toString());
    prompt.start();
    prompt.get(['index'], function (err, result) {
        if(!err){
        index = parseInt(result.index);
        download_track(trs[index]);}
        else
            console.log('error');
});
}
).catch(function(err){
 console.log(err);

});

function download_track(track){
pleer.getUrlAsync(track.id).then(function(res) {
        var filename = track.artist+"-"+track.song+".mp3";
        download_file(res.url, filename);
        
    });
}

function download_file(url, filename){
    var file = fs.createWriteStream(filename);
    var request = http.get(url, function(response) {
      response.pipe(file);
    });
}

