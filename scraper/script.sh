#!/usr/bin/env sh
node ./script.js

LOGFILE=error.log

log(){
    message="$@"
    echo $message
    echo $message >>$LOGFILE
}

log "Cron performed $(date)"
