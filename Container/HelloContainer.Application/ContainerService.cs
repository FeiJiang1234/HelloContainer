using AutoMapper;
using HelloContainer.DTOs;
using HelloContainer.Domain.Abstractions;
using HelloContainer.Domain.Services;
using HelloContainer.SharedKernel;
using Microsoft.Extensions.Caching.Distributed;
using MassTransit.Internals.Caching;
using System.Text.Json;
using HelloContainer.Application.Extensions;
using Microsoft.Extensions.Options;

namespace HelloContainer.Application
{
    public class ContainerService
    {
        private readonly IContainerRepository _containerRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ContainerManager _containerManager;
        private readonly ContainerFactory _containerFactory;
        private readonly IDistributedCache _distributedCache;
        private readonly JsonSerializerOptions _jsonSerializerOptions;
        private static readonly DistributedCacheEntryOptions CacheOptions = new() { 
            AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30) 
        };

        public ContainerService(IContainerRepository containerRepository, IMapper mapper, IUnitOfWork unitOfWork, 
            ContainerManager containerManager, ContainerFactory containerFactory, 
            IDistributedCache distributedCache, IOptions<JsonSerializerOptions> jsonSerializerOptions)
        {
            _containerRepository = containerRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _containerManager = containerManager;
            _containerFactory = containerFactory;
            _distributedCache = distributedCache;
            _jsonSerializerOptions = jsonSerializerOptions.Value;
        }

        public async Task<Result<ContainerReadDto>> CreateContainer(CreateContainerDto createDto)
        {
            var containerResult = await _containerFactory.CreateContainer(createDto.Name, createDto.Capacity);
            if (containerResult.IsFailure)
                return Result.Failure<ContainerReadDto>(containerResult.Error);

            // Domain Layer should not include persistence logic
            _containerRepository.Add(containerResult.Value);
            await _unitOfWork.SaveChangesAsync();
            return Result.Success(_mapper.Map<ContainerReadDto>(containerResult.Value));
        }

        public async Task<IEnumerable<ContainerReadDto>> GetContainers(string? searchKeyword = null)
        {
            var containers = string.IsNullOrEmpty(searchKeyword) ?
                await _containerRepository.GetAll() :
                await _containerRepository.FindAsync(x => x.Name.Contains(searchKeyword));
            return _mapper.Map<IEnumerable<ContainerReadDto>>(containers);
        }

        public async Task<ContainerReadDto?> GetContainerById(Guid id)
        {
            var container = await _distributedCache.CacheForResult(id.ToString(), async () =>
            {
                return await _containerRepository.GetById(id);
            }, _jsonSerializerOptions, CacheOptions);

            return _mapper.Map<ContainerReadDto>(container);
        }

        public async Task<ContainerReadDto> AddWater(Guid containerId, double amount)
        {
            var container = await _containerManager.AddWater(containerId, amount);

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ContainerReadDto>(container);
        }

        public async Task<ContainerReadDto> ConnectContainers(Guid sourceContainerId, Guid targetContainerId)
        {
            var sourceContainer = await _containerManager.ConnectContainers(sourceContainerId, targetContainerId);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ContainerReadDto>(sourceContainer);
        }

        public async Task<ContainerReadDto> DisconnectContainers(Guid sourceContainerId, Guid targetContainerId)
        {
            var sourceContainer = await _containerManager.DisconnectContainers(sourceContainerId, targetContainerId);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ContainerReadDto>(sourceContainer);
        }

        public async Task DeleteContainer(Guid id)
        {
            var container = await _containerRepository.GetById(id);
            if (container != null)
            {
                foreach (var connectedId in container.ConnectedContainerIds.ToList())
                {
                    var connectedContainer = await _containerRepository.GetById(connectedId);
                    if (connectedContainer != null)
                        connectedContainer.Disconnect(id);

                    container.Disconnect(connectedId);
                }

                container.Delete();
                await _unitOfWork.SaveChangesAsync();
            }
        }
    }
}