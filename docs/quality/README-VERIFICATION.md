## README Verification — Lecture 14
Performed on this checkout, following README.md exactly, step
by step,
with no undocumented prior knowledge assumed:
- [x] `git clone` + steps in "Getting Started" produce a runn
ing server
- [x] `git clone` + steps in "Getting Started" produce a runn
ing client
- [x] Every environment variable the app actually requires is
documented
- [x] Every command shown in the README actually runs without
modification
Result: 1 gap found — larger than this section's own example
above.
README.md had no "Getting Started" section at all: no clone
instructions, no npm install, no Docker/Postgres setup, no DA
TABASE_URL
format, no run commands, and no test commands. A genuine newc
omer could
not have gotten the app running from README.md alone at any p
oint
through Lecture 13. Fixed by adding a full "Getting Started"
section:prerequisites, database setup (including the `docker start` v
s
`docker run` distinction from Lecture 8), server setup, clien
t setup,
and how to run all three test suites (including the separate
`inkwell_test` database from Lecture 13).