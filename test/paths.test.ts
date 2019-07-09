import * as assert from 'assert';
import { WorkspaceFolder } from 'vscode-languageserver';
import { join } from 'path';

import {
  relativeToAbsolutePath,
  isRelativePath,
} from '../src/languageservice/utils/paths';
import { URI } from 'vscode-uri';

const describe = require('mocha').describe;
const it = require('mocha').it;

class TestWorkspace {
  folders: WorkspaceFolder[];
  root: URI;

  constructor(workspaceFolders: WorkspaceFolder[], workspaceRoot: string) {
    this.folders = workspaceFolders;
    this.root = URI.parse(workspaceRoot);
  }

  resolve(relPath: string): string {
    return relativeToAbsolutePath(this.folders, this.root, relPath);
  }
}

const ws1 = new TestWorkspace(
  [
    {
      uri: 'file:///home/aFolder/',
      name: 'aFolder',
    },
  ],
  'file:///home/aFolder/'
);

const ws2 = new TestWorkspace(
  [
    {
      uri: 'file:///usr/testuser/projects/workspace/folder-1/',
      name: 'folder-1',
    },
    {
      uri: 'file:///usr/testuser/projects/workspace/folder-2/',
      name: 'folder-2',
    },
    {
      uri: 'file:///usr/testuser/projects/workspace/folder-3/',
      name: 'folder-3',
    },
  ],
  'file:///usr/testuser/projects/workspace/'
);

const ws3 = new TestWorkspace(
  [
    {
      uri: 'file:///c%3A/Users/testuser/dev/carrots',
      name: 'carrots',
    },
    {
      uri: 'file:///c%3A/Users/testuser/dev/potatoes',
      name: 'potatoes',
    },
  ],
  'file:///c%3A/Users/testuser/dev/potatoes'
);

const checkBadPath = (path: string): void => {
  it('Rejects "' + path + '"', () => {
    assert(!isRelativePath(path));
  });
};

const checkGoodPath = (
  path: string,
  expect1: string,
  expect2: string,
  expect3: string
): void => {
  describe('Relative path = "' + path + '"', () => {
    it('Recognises relative path', () => {
      assert(isRelativePath(path));
    });

    it('Resolves relative path in single-root workspace', () => {
      assert.equal(ws1.resolve(path), expect1);
    });

    it('Resolves relative path in multi-root workspace', () => {
      assert.equal(ws2.resolve(path), expect2);
    });

    it('Resolves relative path in multi-root nested workspace', () => {
      assert.equal(ws3.resolve(path), expect3);
    });
  });
};

suite('File path tests', () => {
  describe('Recognises not relative paths', () => {
    checkBadPath(join('/', 'file.json'));
    checkBadPath(join('/', 'absolutepath', 'file.json.'));
    checkBadPath(join('//', 'notrelativepath', 'file.json'));
    checkBadPath(join('C:', 'notrelativepath', 'file.json'));
    checkBadPath(join('directory.json', '/'));
    checkBadPath(join('.', 'dir', 'subdir', '/'));
  });

  describe('Recognises and correctly resolves relative paths', () => {
    checkGoodPath(
      'file.json',
      'file:///home/aFolder/file.json',
      'file:///usr/testuser/projects/workspace/file.json',
      'file:///c%3A/Users/testuser/dev/potatoes/file.json'
    );

    checkGoodPath(
      'file.long.extension.json',
      'file:///home/aFolder/file.long.extension.json',
      'file:///usr/testuser/projects/workspace/file.long.extension.json',
      'file:///c%3A/Users/testuser/dev/potatoes/file.long.extension.json'
    );

    checkGoodPath(
      join('.', 'file.json'),
      'file:///home/aFolder/file.json',
      'file:///usr/testuser/projects/workspace/file.json',
      'file:///c%3A/Users/testuser/dev/potatoes/file.json'
    );

    checkGoodPath(
      join('.', 'folder', 'file.json'),
      'file:///home/aFolder/folder/file.json',
      'file:///usr/testuser/projects/workspace/folder/file.json',
      'file:///c%3A/Users/testuser/dev/potatoes/folder/file.json'
    );

    checkGoodPath(
      join('.', 'long', 'path', 'to', 'file.json'),
      'file:///home/aFolder/long/path/to/file.json',
      'file:///usr/testuser/projects/workspace/long/path/to/file.json',
      'file:///c%3A/Users/testuser/dev/potatoes/long/path/to/file.json'
    );

    checkGoodPath(
      join('..', 'file.json'),
      'file:///home/file.json',
      'file:///usr/testuser/projects/file.json',
      'file:///c%3A/Users/testuser/dev/file.json'
    );

    checkGoodPath(
      join('.', 'relativepath', '..', 'file.json'),
      'file:///home/aFolder/file.json',
      'file:///usr/testuser/projects/workspace/file.json',
      'file:///c%3A/Users/testuser/dev/potatoes/file.json'
    );

    checkGoodPath(
      join('..', '..', 'relative', 'path', 'file.json'),
      'file:///relative/path/file.json',
      'file:///usr/testuser/relative/path/file.json',
      'file:///c%3A/Users/testuser/relative/path/file.json'
    );

    describe('Relative path = a workspace folder', () => {
      const path1 = join('aFolder', 'file.json');
      const path2 = join('folder-2', 'file.json');
      const path3 = join('carrots', 'file.json');

      it('Recognises relative path "' + path1 + '"', () => {
        assert(isRelativePath(path1));
      });

      it('Resolves "' + path1 + '" in single-root workspace', () => {
        assert.equal(ws1.resolve(path1), 'file:///home/aFolder/file.json');
      });

      it('Resolves "' + path2 + '" in multi-root workspace', () => {
        assert.equal(
          ws2.resolve(path2),
          'file:///usr/testuser/projects/workspace/folder-2/file.json'
        );
      });

      it('Resolves "' + path3 + '" in multi-root nested workspace', () => {
        assert.equal(
          ws3.resolve(path3),
          'file:///c%3A/Users/testuser/dev/carrots/file.json'
        );
      });
    });

    describe('Path with mixed delimiters (Windows only)', () => {
      const path = 'some/strange\\but/functional\\path\\file.json';

      it('Recognises relative path "' + path + '"', function() {
        if (process.platform !== 'win32') {
          this.skip();
        } else {
          assert(isRelativePath(path));
        }
      });

      it('Resolves "' + path + '" in single-root workspace', function() {
        if (process.platform !== 'win32') {
          this.skip();
        } else {
          assert.equal(
            ws1.resolve(path),
            'file:///home/aFolder/some/strange/but/functional/path/file.json'
          );
        }
      });

      it('Resolves "' + path + '" in multi-root workspace', function() {
        if (process.platform !== 'win32') {
          this.skip();
        } else {
          assert.equal(
            ws2.resolve(path),
            'file:///usr/testuser/projects/workspace/some/strange/but/functional/path/file.json'
          );
        }
      });

      it('Resolves "' + path + '" in multi-root nested workspace', function() {
        if (process.platform !== 'win32') {
          this.skip();
        } else {
          assert.equal(
            ws3.resolve(path),
            'file:///c%3A/Users/testuser/dev/potatoes/some/strange/but/functional/path/file.json'
          );
        }
      });
    });
  });
});
