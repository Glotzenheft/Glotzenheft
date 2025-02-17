<?php
namespace App\Tests\Controller\API\Search;

//use App\Service\SeriesService;
use PHPUnit\Framework\TestCase;

class SearchTest extends TestCase {
    public function testSearchSeries() {
        $service = new SeriesService();
        $result = $service->search('Solo Leveling');
        
        $this->assertIsArray($result);
        $this->assertNotEmpty($result);
        $this->assertEquals('Solo Leveling', $result[0]['title']);
    }
}
