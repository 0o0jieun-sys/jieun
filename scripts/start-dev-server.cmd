@echo off
cd /d C:\vibecoding\my-shop
npm.cmd run dev -- --hostname 127.0.0.1 > C:\vibecoding\my-shop\dev-server.out.log 2> C:\vibecoding\my-shop\dev-server.err.log
