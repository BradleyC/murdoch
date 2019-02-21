const Helpers = artifacts.require('./contracts/Helpers.sol')
const Murdoch = artifacts.require('./contracts/Murdoch.sol')

module.exports = async deployer => {
  await deployer.deploy(Helpers)

  // link dependencies
  deployer.link(Helpers, [Murdoch])

  // deploy dependencies
  await deployer.deploy(Murdoch)
}