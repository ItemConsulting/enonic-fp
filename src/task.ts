import {ListParams, ProgressParams, SubmitNamedParams, SubmitParams, TaskInfo, TaskLibrary} from "enonic-types/task";
import {catchEnonicError, EnonicError} from "./errors";
import {IOEither} from "fp-ts/IOEither";

let taskLib = __non_webpack_require__("/lib/xp/task");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: TaskLibrary): void {
  taskLib = library;
}

/**
 * Returns the current state and progress details for the specified task.
 */
export function get(taskId: string): IOEither<EnonicError, TaskInfo> {
  return catchEnonicError(
    () => taskLib.get(taskId)
  );
}

/**
 * Checks if any task with the given name or id is currently running.
 */
export function isRunning(task: string): IOEither<EnonicError, boolean> {
  return catchEnonicError(
    () => taskLib.isRunning(task)
  );
}

/**
 * Returns the list of running tasks with their current state and progress details.
 */
export function list(params?: ListParams): IOEither<EnonicError, ReadonlyArray<TaskInfo>> {
  return catchEnonicError(
    () => taskLib.list(params)
  );
}

/**
 * Reports progress information from an executing task.
 * This function may only be called within the context of a task function,
 * otherwise it will fail and throw an exception.
 */
export function progress(params: Partial<ProgressParams>): IOEither<EnonicError, void> {
  return catchEnonicError(
    () => taskLib.progress(params)
  );
}

/**
 * Causes the current execution thread to sleep (temporarily cease execution)
 * for the specified number of milliseconds.
 */
export function sleep(timeMillis: number): IOEither<EnonicError, void> {
  return catchEnonicError(
    () => taskLib.sleep(timeMillis)
  );
}

/**
 * Submits an inlined task (function) to be executed in the background. Returns an id representing the task.
 * This function returns immediately. The callback function will be executed asynchronously.
 */
export function submit(params: SubmitParams): IOEither<EnonicError, string> {
  return catchEnonicError(
    () => taskLib.submit(params)
  );
}

/**
 * Submits a named task to be executed in the background and returns an id representing the task.
 * This function returns immediately. The callback function will be executed asynchronously.
 */
export function submitNamed<A extends object = never>(params: SubmitNamedParams<A>): IOEither<EnonicError, string> {
  return catchEnonicError(
    () => taskLib.submitNamed<A>(params)
  );
}
