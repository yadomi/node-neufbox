var Neufbox = require('./neufbox');

var nb = new Neufbox();

nb.connect( {username: 'admin', password: 'zoidberg'}, function(){
    //doing stuff in this callback is uggly...
    nb.getDnsHostList();
    nb.deleteDnsHost( {ip : '192.168.1.78', name : 'bender.cakelaboratories.com'} );
    nb.addDnsHost( {ip : '192.168.1.46', name : 'bender.cakelaboratories.com'} );
    nb.getDnsHostList();
});
