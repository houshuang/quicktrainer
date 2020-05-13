I am experimenting with learning names and other things using spaced repetition - if I just use Anki, I will have forgotten it by tomorrow, so I need to be able to repeat it much more frequently... 

To run:
yarn install
node index.mjs

(Needs Node > 13.5)

To add questions, add a line to ~/.quicktrainer with question and answer separated by , . The file is automatically deleted after import. I currently use a Keyboard Maestro script to automatically capture questions and write to this file. The file is checked every second.

It will ask you the question, answer yes or no. Based on your answer, it will ask you again one minute later, or a certain number of minutes later. It's based on a variant of the SM2 algorithm, I'm still tweaking the settings to see what works for this kind of intensive practice.

It currently keeps everything in memory, so once you exit, all questions are lost. Much room for improvement :) 
