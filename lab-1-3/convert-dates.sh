#!/bin/bash

sed --regexp-extended 's/\<([1-9][0-9]{3})\/([1-9]|1[0-2])\/([1-9]|[12][0-9]|3[01])\>/\3.\2.\1/' ./test-text-dates.txt >> ./convert-dates-result.txt