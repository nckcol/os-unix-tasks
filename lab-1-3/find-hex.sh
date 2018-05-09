#!/bin/bash

grep --extended-regexp --file="./real-hex.exp" -o ./test-text.txt >> ./find-hex-result.txt

