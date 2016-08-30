<?php
date_default_timezone_set('America/Indiana/Indianapolis');
$function = $_POST['function'];

$log = array();

switch ($function) {

    case('getState'):
        if (file_exists('chat.txt')) {
            $lines = file('chat.txt');
        }
        $log['state'] = count($lines);
        break;

    case('update'):
        // Get the last message currently in the chatbox (i.e. the state)
        $state = $_POST['state'];
        // Make sure there's a chat file
        if (file_exists('chat.txt')) {
            $lines = file('chat.txt');
        }
        $count = count($lines);
        /**
         * If the last message in the chatbox is the last message in the file then we don't have any text to update with.
         * Otherwise we get the number of mess
         */
        if ($state == $count) {
            $log['state'] = $state;
            $log['text'] = false;

        } else {
            $text = array();
            $log['state'] = count($lines);
            foreach ($lines as $line_num => $line) {
                if ($line_num >= $state) {
                    $line = str_replace("\n", "", $line);
                    array_push($text, $line);
                }
            }
            $log['text'] = $text;
        }

        break;

    case('send'):
        $nickname = $_POST['nickname'];
        $message = $_POST['message'];
        if (($message) != "\n" && ($message) != "") {
            fwrite(fopen('chat.txt', 'a'), "<div class='messageholder'><div class='screenname'>" .$nickname ."</div><div class='messagecontent'>" . trim($message) ."</div><div class='messagetime'>" . date('H:i a', time()). "</div></div>" ."\n");
        }
        break;

    case('loadMore'):
        /**
         * Get the current top message and then query the previous 5 messages (if there are five)
         */
        // Get the last message currently in the chatbox (i.e. the state)
        $topMessage = $_POST['topMessage'];
        $start = max(1, $topMessage - 5);
        $stop = $topMessage - 1;
        // Make sure there's a chat file
        if (file_exists('chat.txt')) {
            $lines = file('chat.txt');
        }
        $count = count($lines);
        /**
         * If the last message in the chatbox is the last message in the file then we don't have any text to update with.
         * Otherwise we get the number of mess
         */
        if ($start == $count || $stop <= 0) {
            $log['topMessage'] = $topMessage;
            $log['text'] = false;

        } else {
            $text = array();
            $log['topMessage'] = $start;
            foreach ($lines as $line_num => $line) {
                if ($line_num >= $start && $line_num <= $stop) {
                    $line = str_replace("\n", "", $line);
                    $text = array_merge(array($line), $text);
                }
            }
            $log['text'] = $text;
        }
        break;
}

echo json_encode($log);
