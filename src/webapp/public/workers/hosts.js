let hosts = [];
let address = "N/A";
const fetchInterval = 60 * 1000; // one minute

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
            fetch(host.value.url + "/api/heart-beat/" + address, {
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
      const payload = data.map(({ response, host, ts }) => {
        host.value.address = response.address;
        host.value.balance = response.balance;
        host.value.commission_fee = response.commission_fee;
        host.value.name = response.name;
        host.value.paid_subscription = response.paid_subscription;
        host.value.subscription = response.subscription;
        host.value.subscription_fee = response.subscription_fee;
        host.value.rt = ts;
        return host;
      });
      postMessage({ event: "hosts", payload });
    });
  }, fetchInterval);
}

/**
 * e.data = {
 *   action: 'update_hosts' | 'update_address'
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
    default:
      break;
  }
};
