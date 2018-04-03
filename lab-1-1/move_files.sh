#!/bin/bash

if [ -z $1 ]
then
    echo "Missed source"
    exit 1
else
    source=$1
fi

if [ -z $2 ]
then
    echo "Missed destination"
    exit 1
else
    destination=$2
fi

if ! [ -d $source ]
then
    echo "Source is not a directory"
    exit 1
fi

if ! [ -d $destination ]
then
    echo "Destination is not a directory"
    exit 1
fi

read -p "Enter max file size (200): " max_size

if [ -z "$max_size" ]
then
    max_size=200
fi

if [ "$source" == "$destination" ]
then
    echo "Done!"
    exit 0
fi

sum_size=0
count=0

files=$(find $source -maxdepth 1 -type f -printf "%s %p\n" | sort -n)

while read -r line
do
    filedata=($line)
    size=${filedata[0]}
    filename=${filedata[1]}

    if [ "$size" -ge "$max_size" ]
    then
        break
    fi

    sum_size=$(($sum_size + $size))
    count=$(($count + 1))

    echo "Processing file '$filename' with size of $size bytes"

    mv $filename $destination
done <<< "$files"

echo "Total files: $count"
echo "Total size: $sum_size bytes"
