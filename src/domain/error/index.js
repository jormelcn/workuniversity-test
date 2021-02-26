
class InvalidArgumentError extends Error { }

class NotImplementedError extends Error { }

class InvalidOrderQuantity extends Error {}

class InsufficientWorkingHours extends Error {}

class InaccessibleRepository extends Error {}

class NotFoundError extends Error {}

module.exports = {
    InvalidArgumentError,
    NotImplementedError,
    InvalidOrderQuantity,
    InsufficientWorkingHours,
    InaccessibleRepository,
    NotFoundError,
}
