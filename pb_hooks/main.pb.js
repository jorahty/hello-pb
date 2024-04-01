/// <reference path="../pb_data/types.d.ts" />

/**
 * when users table is updated:
 * - select rows where searching = True
 * - if rows.length == 2:
 *   - allocate gameserver via k8s api
 *   - set `searching` and `gameserver` columns of selected rows
 */
onModelAfterUpdate(() => {
  const rows = arrayOf(new DynamicModel({ id: '', searching: false }));

  $app
    .dao()
    .db()
    .select('id', 'searching')
    .from('users')
    .where($dbx.exp('searching = True'))
    .all(rows);

  if (rows.length != 2) return;

  // const res = $http.send({
  //   url: 'http://10.245.0.1:7823/api/allocation',
  //   method: 'POST',
  //   body: '{}', // ex. JSON.stringify({"test": 123}) or new FormData()
  //   headers: { 'content-type': 'application/json' },
  //   timeout: 120, // in seconds
  // });
  // gameserver = res...
  const gameserver = 'http://agones.dev';
  const rowIds = rows.map(({ id }) => `'${id}'`).join(',');

  $app
    .dao()
    .db()
    .newQuery(
      `UPDATE users
      SET searching = False, gameserver = '${gameserver}'
      WHERE id IN (${rowIds})`
    )
    .execute();
}, 'users');
