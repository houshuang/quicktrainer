import train from "./scheduleTrainer.mjs";
import { exec } from "child_process";
import fs from "fs";
const homedir = os.homedir();

const path = `${homedir}/.quicktrainer`;

let input = {
  currentRepetition: 0, // the current repetition counter
  lastEasinessFactor: 10, // the easiness factor (E-Factor) used in last calculation
  lastInterval: 0, // the last interval amount
  qualityAssessment: 1 // the quality of review [0-5] -> worst to best
};

const questions = [];

const ask = question =>
  console.log(
    question,

    `osascript -e 'tell application (path to frontmost application as text) to display dialog "${question}"? buttons {"No","Yes"} with icon stop'`
  ) ||
  new Promise(resolve =>
    exec(
      `osascript -e 'tell application (path to frontmost application as text) to display dialog "${question}?" buttons {"No","Yes"} with icon stop'`,
      (error, stdout, stderr) => {
        console.log(stdout, stderr);
        resolve(stdout === "button returned:Yes\n");
      }
    )
  );

const tell = answer =>
  new Promise(resolve =>
    exec(
      `osascript -e 'tell application (path to frontmost application as text) to display dialog "Answer: ${answer}" buttons {"OK"} with icon stop'`,
      (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
        resolve();
      }
    )
  );

const main = async () => {
  questions
    .filter(x => x[0] > 0 && x[0] < Date.now())
    .forEach(async f => {
      f[0] = 0;
      ask(f[1]).then(async x => {
        f[3].qualityAssessment = x ? 5 : 1;
        const res = train(f[3]);
        console.log(res);
        f[3].currentRepetition += 1;
        f[3].lastEasinessFactor = res.easiness;
        f[0] = Date.now() + (res.interval || 1) * 60 * 1000;
        if (!x) {
          await tell(f[2]);
        }
      });
    });
  if (fs.existsSync(path)) {
    const f = fs.readFileSync("/users/stian/.quicktrainer", "utf-8");
    const [q, a] = f.trim().split(",");
    questions.push([Date.now() + 60 * 100 * 1, q, a, { ...input }]);
    console.log(questions);
    fs.unlinkSync(path);
  }
  setTimeout(main, 1000);
};

main();
