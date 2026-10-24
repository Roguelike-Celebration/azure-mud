# lib-rlc - A little shared library for RLC MUD's bash scripts
#
# Uses the prefix 'rlc::' for its things.

# shellcheck shell=bash

# This code is Bash 3.x, for compatibility with macOS's system /bin/bash, which is stuck on
# the old Bash 3.x for licensing reasons.


# ========== Messaging ==========

function rlc::info()    { rlc::emit "$*"; }
function rlc::warning() { rlc::emit "WARNING: $*"; }
function rlc::error()   { rlc::emit "ERROR: $*"; }
function rlc::die()     { rlc::error "$*"; exit 1; }
function rlc::verbose() { if rlc::is_verbose; then rlc::info "$*"; fi; }
function rlc::debug()   { if rlc::is_debug;   then rlc::info "debug: $*"; fi; }

function rlc::emit() {
  # All diagnostics go to stderr, including progress and success - stdout is for
  # the program's actual work output.
  local msgline="$*"
  if [[ ${_RLC_EMIT_PROGNAME:-0} == 1 ]]; then
    msgline="${PROGRAM_NAME:-???}: ${msgline}"
  fi
  if [[ ${_RLC_EMIT_TIMESTAMP:-0} == 1 ]]; then
    msgline="$(rlc::now): ${msgline}"
  fi
  echo >&2 "$msgline"
}

function rlc::now() { date +'%Y-%m-%d %H:%M:%S'; }

function rlc::is_verbose() { [[ ${_RLC_VERBOSE:-${RLC_VERBOSE:-${VERBOSE:-0}}} != 0 ]]; }
function rlc::is_debug()   { [[ ${_RLC_DEBUG:-${RLC_DEBUG:-${DEBUG:-0}}}       != 0 ]]; }
function rlc::is_dry_run() { [[ ${_RLC_DRY_RUN:-0} != 0 ]]; }

# ========== Input handling ==========

# rlc::need_env_var VAR_NAME
#
# Validate an input env var: require that it's set and nonempty, and is an exported env var
# and not just a shell variable. Dies if it is not.
function rlc::need_env_var() {
  local var="$1"
  if [[ -z "${!var:-}" ]]; then
    rlc::die "Environment variable ${var} is required"
  fi
  # compgen works with bash 3.x for checking exportedness
  if [[ -z $(compgen -e -X '!'"${var}" ) ]]; then
    rlc::die "Variable ${var} must be an environment variable, not just a shell variable"
  fi
}


# ========== Misc utilities ==========

# rlc::strjoin DELIM [STR...] -- join arguments with DELIM, to stdout.
#
# `IFS=x; "${arr[*]}"` does this natively, but only for a single-character
# delimiter, only from an array, and only by touching IFS.
#
# Not the ${out:+${out}$delim} accumulator idiom: that reads an empty accumulator as
# unset, so a leading empty argument loses its delimiter.
function rlc::strjoin() {
  local _rlc_strjoin_delim="$1"; shift
  local _rlc_strjoin_out='' _rlc_strjoin_s _rlc_strjoin_first=1

  for _rlc_strjoin_s in "$@"; do
    if [[ $_rlc_strjoin_first == 1 ]]; then
      _rlc_strjoin_out="$_rlc_strjoin_s"
      _rlc_strjoin_first=0
    else
      _rlc_strjoin_out="${_rlc_strjoin_out}${_rlc_strjoin_delim}${_rlc_strjoin_s}"
    fi
  done
  printf '%s\n' "$_rlc_strjoin_out"
}

# rlc::strsplit OUT_ARRAY_NAME STRING [DELIM] - Split STRING on DELIM (default ':')
#
# OUT_ARRAY_NAME is the name of the array variable for output. The output is assigned as an
# array to the variable with that name.
#
# DELIM may be multi-character. It's a literal string, not a glob or regex pattern.
#
# Empty components are dropped - multiple sequential delims are equivalent to a single delim.
function rlc::strsplit() {
  # Use prefixes on local variables to avoid colliding with OUT_ARRAY_NAME.
  local _rlc_strsplit_out="$1" _rlc_strsplit_rest="$2" _rlc_strsplit_delim="${3-:}"
  local _rlc_strsplit_item
  local -a _rlc_strsplit_parts=()

  # An empty delimiter would match everywhere and never shrink $rest.
  if [[ -z $_rlc_strsplit_delim ]]; then
    rlc::error "rlc::strsplit: DELIM must not be empty"
    return 1
  fi
  while [[ -n $_rlc_strsplit_rest ]]; do
    # "$delim" quoted in all three patterns: unquoted, a delimiter of "*" becomes a glob
    # that matches strings not containing it, and the loop spins forever.
    case "$_rlc_strsplit_rest" in
      *"$_rlc_strsplit_delim"*)
        _rlc_strsplit_item="${_rlc_strsplit_rest%%"$_rlc_strsplit_delim"*}"
        _rlc_strsplit_rest="${_rlc_strsplit_rest#*"$_rlc_strsplit_delim"}"
        ;;
      *)
        _rlc_strsplit_item="$_rlc_strsplit_rest"
        _rlc_strsplit_rest=''
        ;;
    esac
    if [[ -n $_rlc_strsplit_item ]]; then
      _rlc_strsplit_parts+=("$_rlc_strsplit_item")
    fi
  done
  # Escaped $ so eval's own parse expands the array, keeping elements with spaces intact.
  eval "${_rlc_strsplit_out}=( \${_rlc_strsplit_parts[@]+\"\${_rlc_strsplit_parts[@]}\"} )"
}
