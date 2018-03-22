### Coverage/Jenkins Support
To report the code coverage of iTrust, we used a plugin in Jenkins called JaCoCo. iTrust by default, on running the command ```mvn clean test verify checkstyle:checkstyle``` generates a jacoco-ut.exec file which is imported by the JaCoCo plugin and displays a window which displays the code coverage of all the test cases. Below is an image of what the output of the JaCoCo window looks like: 

![img](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m2/content/iTrust_JaCoCo.png)


### Automated Commit Generation - Commit Fuzzer
The fuzzing pipeline goes as follows:
1. Fuzz the source code.
2. Commit the fuzzed files.
3. Build the job using a post-commit hook.
4. Revert the committed changes.

It takes a directory path and randomly selects a sample list of files, and modifies them. As part of the fuzzing, we created random changes in the file by following the given fuzzing operations:

1. change content of "strings" in code ( with a random string of 10 characters )
2. swap "<" with ">"
3. swap "==" with "!="
4. swap 0 with 1
5. any operation you can think of (here we swapped "&&" with "||")

Basically, the fuzzer tests the effectiveness of testing, rather the test cases. Fuzzing enables us to determine those test cases that do not thoroughly test the source code by virtue of passing or failing each time, even on fuzzing the source code. These test cases can be deemed as ineffective as they are unaffected by the fuzzing. Thus, the fuzzer can help to detect useless test cases.

### Test Prioritization Analysis
We analyzed the reports of our test cases and generated a report that displayed the test cases in which we sorted the test cases based on the status of the test case and the average time required for the test case execution. The first criteria for sorting the test cases is the number of times the test case failed, and the next criteria is the the average time required for the test case execution. The average time required for the test case execution is calcualted over the 100 builds that we performed. The test cases that fail each time or never fail for each of the 100 builds could be improved. Thus, the test cases in the bottom part of the test report i.e. those which never failed are sufficiently resilient. The failing test cases at the top of report are those that the developer needs to ensure that the application could be modified to handle these test cases. However, a test case failing all the time could also be deemed as faulty.


### Automated Test Generation

