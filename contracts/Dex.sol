pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./HodlToken.sol";

/// @dev Hand-made Automated Market Maker for HodlToken/ETH pair
contract Dex {

  IERC20 public token;

  uint256 public totalLiquidity;
  mapping (address => uint256) public liquidity;

  constructor(address token_addr) public {
    token = IERC20(token_addr);
  }

  /// @dev We're filling the reserve, initialising the Dex with the set Ratio
  /// Initial ratio 1:0.00001 Eth ($.024pt)
  function init(uint256 tokens) public payable returns (uint256) {
    require(totalLiquidity == 0, 'DEX - Already has liquidity');
    totalLiquidity = address(this).balance;
    liquidity[msg.sender] = totalLiquidity;
    require(token.transferFrom(msg.sender, address(this), tokens));
    return totalLiquidity;
  }

  /// @dev This function calculate the price based on the pool's reserve in both assets
  function price(uint256 input_amount, uint256 input_reserve, uint256 output_reserve) public view returns (uint256) {
    uint256 input_amount_with_fee = input_amount * 995;
    uint256 numerator = input_amount_with_fee * output_reserve;
    uint256 denominator = input_reserve * 1000 + input_amount_with_fee;
    return numerator / denominator;
  }

  /// @dev
  function ethToHodlToken() public payable returns (uint256) {
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 tokens_bought = price(msg.value, address(this).balance - msg.value, token_reserve);
    require(token.transfer(msg.sender, tokens_bought));
    return tokens_bought;
  }

  /// @dev
  function hodlTokenToEth(uint256 tokens) public returns (uint256) {
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 eth_bought = price(tokens, token_reserve, address(this).balance);
    payable(msg.sender).transfer(eth_bought);
    require(token.transferFrom(msg.sender, address(this), tokens));
    return eth_bought;
  }

  /// @dev function to deposit to the pool
  function deposit() public payable returns (uint256) {
    uint256 eth_reserve = address(this).balance - msg.value;
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 token_amount = (msg.value * token_reserve / eth_reserve) + 1;
    uint256 liquidity_minted = msg.value * totalLiquidity / eth_reserve;
    liquidity[msg.sender] = liquidity[msg.sender] + liquidity_minted;
    totalLiquidity = totalLiquidity + liquidity_minted;
    require(token.transferFrom(msg.sender, address(this), token_amount));
    return liquidity_minted;
  }

  function withdraw(uint256 amount) public returns (uint256, uint256) {
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 eth_amount = amount * address(this).balance / totalLiquidity;
    uint256 token_amount = amount * token_reserve / totalLiquidity;
    liquidity[msg.sender] = liquidity[msg.sender] - eth_amount;
    totalLiquidity = totalLiquidity - eth_amount;
    payable(msg.sender).transfer(eth_amount);
    require(token.transfer(msg.sender, token_amount));
    return (eth_amount, token_amount);
  }

  function withdrawCalc(uint256 amount) public view returns (uint256, uint256) {
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 eth_amount = amount * address(this).balance / totalLiquidity;
    uint256 token_amount = amount * token_reserve / totalLiquidity;
    return (eth_amount, token_amount);
  }
}
