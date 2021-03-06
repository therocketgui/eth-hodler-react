pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./HodlToken.sol";

/// @title A Contract to Hodl (lock) funds until a defined time in the future
/// @author G. T. SA.
/// @notice This contract should be used to lock funds from yourself. There is no coming back after you lock your funds.
// contract Hodler is HodlToken {
contract Hodler is HodlToken {

  address owner;
  uint256 public totalLocked;
  uint256 public totalUnlocked;
  uint _mintAmount;

  event NewHodl(uint hodlId, address indexed owner, uint amount, uint timelocked, uint createdAt);
  event ClosedHodl(uint hodlId, address indexed owner, uint amount, uint timelocked, uint closedAt);

  struct Hodl {
    address owner;
    address otherOwner;
    uint amount;
    uint timelocked;
    uint createdAt;
    bool closed;
  }

  Hodl[] public hodls;

  /// @dev Mapping to store which hodl belongs to whom
  mapping(uint => address) public hodlToOwner;
  mapping(address => uint) ownerHodlCount;
  mapping(address => uint) ownerTotalLocked;
  mapping(address => uint) ownerTotalUnlocked;

  /// @notice - Lock Function - Owner defines a time in days he wants he's funds to be locked from himself
  /// @dev Logs into a struct that'll be used to verify is Unlock is possible and if unlock has happened
  /// Time is set in days "timelocked*60*60*24"
  /// When no backupAddress is present, it'll be defined as address(0)
  function lockHodl(uint timelocked) external payable {
    hodls.push(Hodl(msg.sender, address(0), msg.value, uint64(block.timestamp + timelocked*60*60*24), uint64(block.timestamp), false));
    ownerHodlCount[msg.sender]++;
    hodlToOwner[hodls.length - 1] = msg.sender;
    ownerTotalLocked[msg.sender] += msg.value;
    totalLocked += msg.value;

    if (timelocked >= 365) {
      mint(msg.sender, mintCalculator(msg.value, timelocked));
    }

    emit NewHodl(hodls.length - 1, msg.sender, msg.value, uint64(block.timestamp + timelocked*60*60*24), uint64(block.timestamp));
  }

  /// @dev Makes every modified functions accessible for the owner's address and owner's backup address
  modifier onlyOwnerOf(uint _hodlId) {
    require(msg.sender == hodlToOwner[_hodlId] || msg.sender == hodls[_hodlId].otherOwner, "Sender not authorized");
    _;
  }

  /// @notice - Modify Backup Address
  /// @dev Hodl Owner's address or BackupAddress can modify the BackupAddress
  /// this function can be called at any time and any number of times
  function modifyHodlBackup(uint _hodlId, address _backupAddress) public onlyOwnerOf(_hodlId) {
    hodls[_hodlId].otherOwner = _backupAddress;
  }

  /// @notice - Unlock Function - After this time the Hodl owner can withdraw
  /// @dev only available to the hodl owner / verify that current time is inferior to defined timelocked time
  /// If called by backupAddress, it will pay the backupAddress
  function unlockHodl(uint _hodlId) public onlyOwnerOf(_hodlId) {
    Hodl storage myHodl = hodls[_hodlId];
    require(uint64(myHodl.timelocked) <= uint64(block.timestamp));
    require(myHodl.closed == false);

    if (msg.sender == myHodl.otherOwner) {
      payable(myHodl.otherOwner).transfer(myHodl.amount);
    } else {
      payable(myHodl.owner).transfer(myHodl.amount);
    }

    myHodl.closed = true;
    totalUnlocked += myHodl.amount;
    ownerTotalUnlocked[msg.sender] += myHodl.amount;

    // uint ethPriceAtClose = uint(getEthPrice());
    emit ClosedHodl(_hodlId, myHodl.owner, myHodl.amount, myHodl.timelocked, uint64(block.timestamp));
  }

  /// @notice - View the total count of Hodls
  function getHodlsCount() public view returns(uint) {
    return uint(hodls.length);
  }

  /// @notice - Get hodls by owner (ids)
  function getHodlsByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerHodlCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < hodls.length; i++) {
      if (hodlToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  /// @notice - Getters for owner's data
  function getTotalLockedByOwner(address _owner) external view returns(uint) {
    return ownerTotalLocked[_owner];
  }

  function getTotalUnlockedByOwner(address _owner) external view returns(uint) {
    return ownerTotalUnlocked[_owner];
  }

  /// @dev Timelocked should count more than the amount - the goal being to lock money longer
  function mintCalculator(uint _amount, uint _timelocked) private returns(uint) {
    _mintAmount = (((_amount / 10**14) * (_timelocked*_timelocked * 10**2)) / 10**9);
    return _mintAmount;
  }
}
