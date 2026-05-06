#!/usr/bin/env node
import { run } from '../src/cli.js';
run().then((code) => { process.exitCode = code; }).catch((error) => { console.error(error.message); if (error.details) console.error(JSON.stringify(error.details)); process.exitCode = 1; });
