/**
 * Browser stand-in for Node's `https` module.
 *
 * `lib/apiClient.js` (vendored verbatim) builds an `https.Agent` for the axios
 * instance. Agents are a Node-only concept and axios ignores the option in the
 * browser, so an inert constructor is enough to keep the import resolvable.
 */
class Agent {
  constructor(options = {}) {
    this.options = options
  }
}

export { Agent }
export default { Agent }
