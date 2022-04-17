let hosts = [];
let threads = [];
let address = "N/A";
const fetchInterval = 5000; // every 5 seconds

let currentInterval = null;
function initInterval() {
  if (!!currentInterval) {
    clearInterval(currentInterval);
  }
  currentInterval = setInterval(() => {
    if (address === "N/A") return;
    Promise.all(
      hosts.map(
        (host) =>
          new Promise((resolve, reject) => {
            const ts = Date.now();
            fetch(host.value.url + "/api/channels/list?member=" + address, {
              method: "GET",
            })
              .then(async (response) => {
                const decoder = new TextDecoder();
                const body = await response.body.getReader().read();
                resolve({
                  response: JSON.parse(decoder.decode(body.value)),
                  host,
                  ts: Date.now() - ts,
                });
              })
              .catch(reject);
          })
      )
    ).then(async (data) => {
      const contacts = [];
      const results = data
        .map((record) => {
          return record.response.data.map((item) => {
            item.members = item.members.map((member) => {
              const found = !!contacts.find(
                (cnt) => cnt.address === member.address
              );
              if (!found) {
                contacts.push(member);
              }
              return member.address;
            });
            return { ...item, hosts: [record.host.id] };
          });
        })
        .reduce((prev, 
          ) => [...prev, ...curr])
        .filter((record) => !threads.includes(record.universal_id));
      postMessage({
        event: "new_threads",
        payload: { threads: results, contacts },
      });
    });
  }, fetchInterval);
}

/**
 * e.data = {
 *   action: 'update_hosts' | 'update_address | update_threads'
 *   payload: hosts[] | string as address
 * }
 */
onmessage = ({ data }) => {
  const { action, payload } = data;
  switch (action) {
    case "update_address":
      address = payload;
      initInterval();
      break;
    case "update_hosts":
      hosts = payload;
      initInterval();
      break;
    case "update_threads":
      threads = payload;
      initInterval();
      break;
    default:
      break;
  }
};
