import PocketBase from './pocketbase.es.mjs';
const pb = new PocketBase('http://127.0.0.1:8090');

// authenticate
const authData = await pb.collection('users').authWithPassword('jtennant@ucsc.edu', 'gengelbach');

// listen for changes to gameserver
const id = authData.record.id;
pb.collection('users').subscribe(id, (e) => {
  console.log('e.action', e.action);

  console.log('gameserver', e.record.gameserver);
  if (e.record.gameserver) {
    console.log('go');
    window.location.assign(e.record.gameserver);
  }
});

// set searching to true
play.onclick = async () => {
  const record = await pb.collection('users').update(id, {
    searching: true,
  });

  console.log(record);
};
