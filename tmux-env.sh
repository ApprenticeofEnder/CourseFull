#!/bin/bash
SESSION_NAME="coursefull"

tmux has-session -t $SESSION_NAME 2>/dev/null

if [ $? != 0 ]; then
    tmux new-session -d -s $SESSION_NAME -n dev_server

    tmux send-keys -t $SESSION_NAME:dev_server "just dev" C-m

    tmux new-window -t $SESSION_NAME -n test_server
    tmux new-window -t $SESSION_NAME -n test
    tmux new-window -t $SESSION_NAME -n git

    tmux set-option -t $SESSION_NAME status on

    tmux select-window -t $SESSION_NAME:dev_server
fi

tmux attach-session -t $SESSION_NAME
