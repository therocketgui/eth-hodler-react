import sys

_timelocked = int(sys.argv[1])

if _timelocked < 90:
  _timeboost = 10**(_timelocked/10)
elif 90 < _timelocked < 180:
  _timeboost = 10**(_timelocked/10)

print(_timeboost)


# Amount = 1 000 000 000 000

# Timelock = 30 / 90 / 365 / 720


# Timelock =
