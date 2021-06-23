import time
from datetime import datetime
import re
import os
import json
import random
from random import shuffle
import time

#
#
#
def toWei(_input):
  return _input * 1000000000000000000

def fromWei(_input):
  return _input / 1000000000000000000

class Dex():

    def __init__(self, tokenBalance, ethBalance):
      self.tokenBalance = tokenBalance
      self.ethBalance = ethBalance
      # ratio 1000 : 0.01
      return

    def price(self, input_amount, input_reserve, output_reserve):
      # uint256 input_amount_with_fee = input_amount * 995;
      # uint256 numerator = input_amount_with_fee * output_reserve;
      # uint256 denominator = input_reserve * 1000 + input_amount_with_fee;
      # return numerator / denominator;
      _input_amount_with_fee = input_amount * 995

      numerator = _input_amount_with_fee * output_reserve
      denominator = input_reserve * 1000 + _input_amount_with_fee

      #
      return numerator / denominator

    def ethToToken(self, _eth):
      print("New order")
      print("Sell "+str(fromWei(_eth))+ " Eth")
      # uint256 token_reserve = token.balanceOf(address(this));
      # uint256 tokens_bought = price(msg.value, address(this).balance - msg.value, token_reserve);
      # require(token.transfer(msg.sender, tokens_bought));
      # return tokens_bought;
      tokens_bought = self.price(_eth, self.ethBalance, self.tokenBalance)
      print("Price: "+ str(self.price(_eth, self.ethBalance, self.tokenBalance)))
      #
      self.ethBalance += _eth
      self.tokenBalance -= tokens_bought

      #
      print("Balances - TokenBalance: " + str(self.tokenBalance) + " EthBalance: " + str(fromWei(self.ethBalance)))
      return tokens_bought

    def tokenToEth(self, _tokens):
      print("New order")
      print("Sell "+str(_tokens) + " Tokens")
      # uint256 token_reserve = token.balanceOf(address(this));
      # uint256 eth_bought = price(tokens, token_reserve, address(this).balance);
      # payable(msg.sender).transfer(eth_bought);
      # require(token.transferFrom(msg.sender, address(this), tokens));
      # return eth_bought;
      eth_bought = self.price(_tokens, self.tokenBalance, self.ethBalance)
      print("Price: "+ str(fromWei(self.price(_tokens, self.tokenBalance, self.ethBalance))))
      #
      self.tokenBalance += _tokens
      self.ethBalance -= eth_bought

      #
      print("Balances - TokenBalance: " + str(self.tokenBalance) + " EthBalance: " + str(fromWei(self.ethBalance)))
      return eth_bought

    def deposit(self, eth):
      # function deposit() public payable returns (uint256) {
      #   uint256 eth_reserve = address(this).balance - msg.value;
      #   uint256 token_reserve = token.balanceOf(address(this));


      #   uint256 token_amount = (msg.value * token_reserve / eth_reserve) + 1;

      #   uint256 liquidity_minted = msg.value * totalLiquidity / eth_reserve;

      #   liquidity[msg.sender] = liquidity[msg.sender] + liquidity_minted;

      #   totalLiquidity = totalLiquidity + liquidity_minted;

      #   require(token.transferFrom(msg.sender, address(this), token_amount));

      #   return liquidity_minted;
      # WTF???????
      token_amount = (toWei(eth) * self.tokenBalance / self.ethBalance) + 1
      print(self.tokenBalance)
      print(self.ethBalance)
      print(fromWei(token_amount))

      liquidity_minted = toWei(eth) * self.ethBalance / self.ethBalance

      self.ethBalance += eth
      self.tokenBalance += fromWei(token_amount)

      print("Deposit: "+str(eth)+" Token Amount: "+str(fromWei(token_amount))+ " Liquidity_minted: "+ str(fromWei(liquidity_minted)))
      print("Balances - TokenBalance: " + str(self.tokenBalance) + " EthBalance: " + str(fromWei(self.ethBalance)))

      return liquidity_minted

    def withdraw(amount):
      # uint256 token_reserve = token.balanceOf(address(this));
      # uint256 eth_amount = amount * address(this).balance / totalLiquidity;
      # uint256 token_amount = amount * token_reserve / totalLiquidity;
      # liquidity[msg.sender] = liquidity[msg.sender] - eth_amount;
      # totalLiquidity = totalLiquidity - eth_amount;
      # payable(msg.sender).transfer(eth_amount);
      # require(token.transfer(msg.sender, token_amount));
      # return (eth_amount, token_amount);
      return

if __name__ == "__main__":

  # Ratio = 1000 : 1
  dex = Dex(100000, toWei(100))

  # _price = dex.price(100, dex.tokenBalance, dex.ethBalance)
  i = 0
  while i == 0:
    _type, amount = input("ett/tte/dep - Amount: ").split()

    if _type == "ett":
      dex.ethToToken(toWei(float(amount)))
      print('\r')
    elif _type == "tte":
      dex.tokenToEth(int(amount))
      print('\r')
    elif _type == "dep":
      dex.deposit(toWei(float(amount)))
      print('\r')


