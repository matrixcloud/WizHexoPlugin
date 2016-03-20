#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
	string cmd;
	cmd.append("hexo d -g");
	cmd.append(" --cwd ");
	cmd.append(argv[1]);
	system(cmd.c_str());
}