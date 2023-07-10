async function getAllCardList(env) {
  try {
    const { cards } = await fetchWrapper('/fetch-route', 'GET', env).then(res => res.json());
    console.log('All Cards', cards);
    return cards;
  } catch (err) {
    console.error('Error occurred while getting cards list', err);
  }
}

function addNewCard(card, env) {
    return fetchWrapper('/add-route', 'POST', env, card).then((response) => {
      if (response.ok) console.log(`Added card for ${card?.label} with appKey ${card?.appKey} in ${env} - passed`);
      else console.error(`Added card for ${card?.label} with appKey ${card?.appKey} in ${env} - failed`);
    });
}

function deleteCard(card, env) {
    return fetchWrapper('/delete-route', 'DELETE', env, card).then((response) => {
      if (response.ok)console.log(`Deleting card for ${card?.label} with appKey ${card?.appKey} in ${env} - passed`);
      else console.error(`Deleting card for ${card?.label} with appKey ${card?.appKey} in ${env} - failed`);
    })
}

const journey = {
  from: 'STAGE',
  to: ['TST', 'DEV'],
};

const token = {
    TST: 'TST-token',
    STAGE: 'STAGE-token',
    DEV: 'DEV-token',
    PROD: 'PROD-token'
}

const base_url = {
    TST: 'TST-BaseUrl',
    STAGE: 'STAGE-BaseUrl',
    DEV: 'DEV-BaseUrl',
    PROD: 'PROD-BaseUrl'
}


function fetchWrapper(url, method, env, body) {
    return fetch(`${base_url[env]}${url}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'tap-api-token': token[env]
    },
    body: body && JSON.stringify(body)
  });
}

async function init(iconTextAsArray = []) {
  const cards = await getAllCardList(journey.from);
  const filteredCards = iconTextAsArray.length ? cards.filter(({ slabel }) => (iconTextAsArray.includes(slabel))) : cards;
    for (const card of filteredCards) {
      for (const to of journey.to) {
        await deleteCard(card, to);
        await addNewCard(card, to);
      }
    }
}

// {Array | Empty} - the icon text as array & Passing empty value will replace all the cards
init(['AM']);
