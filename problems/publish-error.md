# Publish Error

## Details

Enonic could not publish the content. This can be because the content is not on the branch you think, or that you are 
not currently on the branch you think.

## Solution

 1. Use "Content Studio" or "Data toolbox" to ensure that the data on the branch you expect.
 2. Use `get()` from the *Context-library* to know which branch you are on when you are trying to create content and
    publish.
 3. Use `run()` from the *Context-library* to force the context you need to have the content appear on both "draft"
    "master" branches correctly.
