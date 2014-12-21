var Neufbox = require('./neufbox');

var nb = new Neufbox();

nb.connect( {username: 'admin', password: 'zoidberg'}, function(err, res){
    if(err){
        console.log(err);
        return false
    }
    doStuff();
});

var doStuff = function(){

    nb.getInfo(function(info){
        console.log(info.iad);
    });

    nb.getClients(function(clients){
        console.log(clients);
    });

    // nb.getDnsHostList(function(err, res){
    //     console.log(res);
    // });

    // nb.addDnsHost( {name : 'test.lan', ip: '192.168.1.45' }, function(err, res){
    //     console.log(res);
    // });

}
