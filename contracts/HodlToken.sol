pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @dev this contract is to create an ERC20 token to be minted and burned by Hodler
contract HodlToken is ERC20, AccessControl {
  // bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  // bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
  // bytes32 public constant DEFAULT_ADMIN_ROLE = keccak256("DEFAULT_ADMIN_ROLE");

  /// @dev Set msg.sender as Admin, he'll be replaced by the smart contract afterwards
  constructor() ERC20("Hodl", "HODL") public {
      // _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  /// @dev Function to set Hodler as unique minter
  /// - Need to remove msg.sender as Admin afterwards (and check if it works)
  // function setMinter(address _minter) public view {
  //   require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
  //   _setupRole(MINTER_ROLE, _minter);
  // }

  // function killAdmin() public view {
  //   require(hasRole(DEFAULT_ADMIN_ROLE), msg.sender));
  //   renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
  // }

  /// @dev For testing
  function publicMint(address to, uint256 amount) public {
      // require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
      _mint(to, amount);
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
