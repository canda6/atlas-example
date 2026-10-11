import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
const atlasDir = execFileSync('go', ['list', '-m', '-f', '{{.Dir}}', 'github.com/canda6/atlas'], {
  encoding: 'utf8', env: { ...process.env, GOPROXY: 'off', GOTOOLCHAIN: 'auto' },
}).trim();
if (!atlasDir) throw new Error('Atlas dependency unavailable locally; prepare Go dependencies first');
mkdirSync('src/gen', { recursive: true });
const files = ['../proto/auth/messages.proto','../proto/logic/player.proto','../proto/room/messages.proto'];
execFileSync(process.execPath, ['node_modules/protobufjs-cli/bin/pbjs','-t','static-module','-w','es6','--no-create','--no-verify','--no-convert','-p',join(atlasDir, 'pkg/proto'),'-o','src/gen/messages.js',...files], {stdio:'inherit'});
execFileSync(process.execPath, ['node_modules/protobufjs-cli/bin/pbts','-o','src/gen/messages.d.ts','src/gen/messages.js'], {stdio:'inherit'});
