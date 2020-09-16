# Unpublish Error

## Details

Enonic could not unpublish the content. You might not be in the context you expect.

## Solution

 1. Use "Content Studio" or "Data toolbox" to ensure that the data on the branch you expect.
 2. Use `get()` from the *Context-library* to know which branch you are on when you are trying to create content and
    publish.
 3. Use `run()` from the *Context-library* to force the context you need to have the content appear on both "draft"
    "master" branches correctly.

