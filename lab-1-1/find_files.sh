#!/bin/bash

if [ -z $1 ]
then
    echo "Missed first parameter"
    exit
else
    directory=$1
fi

if [ -z $2 ]
then
    suffix=""
else
    suffix=$2
fi

files=$(find $directory -type f -name "*$suffix" -printf "%A@ %p\n")
sorted=$(echo "$files" | sort -n -r)
cutted=$(echo "$sorted" | cut -d " " -f 2-)

read -p "Enter result filename (result.txt): " filename

if [ -z "$filename" ] 
then
    filename='result.txt'
fi

echo "$cutted" > "$filename"

echo "All finded files was sorted by access time in descendant order and written into '$filename'."