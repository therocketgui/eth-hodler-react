pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @dev this contract is to create an ERC20 token to be minted and burned by Hodler
contract HodlToken is ERC20, AccessControl {
  // bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  // bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

  /// @dev Set msg.sender as Admin, he'll be replaced by the smart contract afterwards
  constructor() ERC20("Hodl", "HODL") public {
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

  /// @dev Only accessible from Lock Function
  function mint(address to, uint256 amount) internal {
      // require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
      _mint(to, amount);
  }

  /// @dev Only accessible from Unlock Function
  function burn(address from, uint256 amount) internal {
      // require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
      _burn(from, amount);
  }
}
