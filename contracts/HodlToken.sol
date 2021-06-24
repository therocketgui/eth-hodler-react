pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @dev this contract is to create an ERC20 token to be minted and burned by Hodler
contract HodlToken is ERC20, AccessControl {

  constructor() ERC20("Hodl", "HODL") public {}

  // /// @dev For testing
  // function publicMint(address to, uint256 amount) public {
  //     // require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
  //     _mint(to, amount);
  // }

  /// @dev Only accessible from Lock Function
  function mint(address to, uint256 amount) internal {
      _mint(to, amount);
  }

  /// @dev Only accessible from Unlock Function
  function burn(address from, uint256 amount) internal {
      _burn(from, amount);
  }
}
