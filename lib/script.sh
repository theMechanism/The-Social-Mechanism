#!/usr/bin/env sh
node /path/to/thesocialmechanism/lib/twitterupdate.js
node /path/to/thesocialmechanism/lib/instaupdate.js
node /path/to/thesocialmechanism/lib/voiceupdate.js

LOGFILE=/path/to/thesocialmechanism/lib/error.log

log(){
    message="$@"
    echo $message
    echo $message >>$LOGFILE
}

log "Cron performed $(date)"
