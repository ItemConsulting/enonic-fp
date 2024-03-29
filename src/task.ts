import { TaskInfo, ExecuteFunctionParams, SubmitTaskParams, ListTasksParams, TaskProgressParams } from "/lib/xp/task";
import { catchEnonicError, type EnonicError, notFoundError } from "./errors";
import { chain, IOEither } from "fp-ts/es6/IOEither";
import * as taskLib from "/lib/xp/task";
import { pipe } from "fp-ts/es6/function";
import { fromNullable } from "./utils";

/**
 * Returns the current state and progress details for the specified task.
 */
export function get(taskId: string): IOEither<EnonicError, TaskInfo> {
  return pipe(
    catchEnonicError(() => taskLib.get(taskId)),
    chain(fromNullable(notFoundError))
  );
}

/**
 * Checks if any task with the given name or id is currently running.
 */
export function isRunning(task: string): IOEither<EnonicError, boolean> {
  return catchEnonicError(() => taskLib.isRunning(task));
}

/**
 * Returns the list of running tasks with their current state and progress details.
 */
export function list(params: ListTasksParams): IOEither<EnonicError, ReadonlyArray<TaskInfo>> {
  return catchEnonicError(() => taskLib.list(params));
}

/**
 * Reports progress information from an executing task.
 * This function may only be called within the context of a task function,
 * otherwise it will fail and throw an exception.
 */
export function progress(params: TaskProgressParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => taskLib.progress(params));
}

/**
 * Causes the current execution thread to sleep (temporarily cease execution)
 * for the specified number of milliseconds.
 */
export function sleep(timeMillis: number): IOEither<EnonicError, void> {
  return catchEnonicError(() => taskLib.sleep(timeMillis));
}

/**
 * Submits an inlined task (function) to be executed in the background. Returns an id representing the task.
 * This function returns immediately. The callback function will be executed asynchronously.
 */
export function executeFunction(params: ExecuteFunctionParams): IOEither<EnonicError, string> {
  return catchEnonicError(() => taskLib.executeFunction(params));
}

/**
 * Submits a named task to be executed in the background and returns an id representing the task.
 * This function returns immediately. The callback function will be executed asynchronously.
 */
export function submitTask<Config extends Record<string, unknown> = Record<string, unknown>>(
  params: SubmitTaskParams<Config>
): IOEither<EnonicError, string> {
  return catchEnonicError(() => taskLib.submitTask<Config>(params));
}
